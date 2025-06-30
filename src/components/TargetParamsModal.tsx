import {useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { X} from 'lucide-react';
import { CustomParam} from '../data/interfaces.ts';

import {addCustomParam, deleteCustomParam,updateCustomParam, getCustomParams} from "../database/database.ts";

import { toast, Toaster } from 'react-hot-toast';



interface CustomParamProps {
  customParams: CustomParam[];
  setCustomParams: (cps: CustomParam[]) => void;
  customParam: CustomParam;
}
function CustomParams({customParam, setCustomParams, customParams } : CustomParamProps) {
  return ( <div className={"group "}>
    <label className="block text-sm font-medium text-gray-700">
      {customParam.name}
    </label>
    <div className={"flex flex-row items-center gap-2"}>
      <input
          type="text"

          key={customParam.id}
          maxLength={1000}
          value={customParam.value}
          onChange={(e) => {

            updateCustomParam(customParam.id, {
              value: e.target.value,
            })

            setCustomParams(customParams.map((custom) => {
              if (custom.id == customParam.id){
                return {...custom, value: e.target.value}
              }
              return custom;
            }))



          }

          }
          className="text-black my-2 block w-full rounded-md p-2 border-gray-200 border-2 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder={`Enter ${customParam.name} (e.g., ${customParam.placeholder})`}
      />
      <button className={"group-hover:opacity-100 transition opacity-0 rounded-full bg-gray-200 hover:bg-gray-300 p-2"} onClick={() => {
        setCustomParams(customParams.filter((cp) => cp.id !== customParam.id))
        deleteCustomParam(customParam.id)
      }}>
        <X className=" text-black w-4 h-4"/>

      </button>
    </div>

  </div>)
}
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function TargetParamsModal({  isOpen, onClose  }: Props) {




  const [isAddingCustomParam, setIsAddingCustomParam] = useState<boolean>(false);

  const [newCustomParamValue, setNewCustomParamValue] = useState<CustomParam>({
    id: new Date().toISOString(),
    name: "",
    value: "",
    placeholder:""
  });


  const [customParams, setCustomParams] = useState<CustomParam[]>([]);

  const setStoreCustomParams = useStore((state) => state.setCustomParams);


  const [searchValue, setSearchValue] = useState<string>("");

  const targetModalRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
     getCustomParams().then((custom_param) => {
       setCustomParams(custom_param)
     })
  }, [])

  useEffect(() => {
    if (customParams) {
      setStoreCustomParams(customParams);
    }
  }, [customParams]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
          targetModalRef.current &&
          !targetModalRef.current.contains(e.target as Node)
      ) {
       onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });

  if (!isOpen) return null;





  return (
    <div className="fixed inset-0 z-[200] bg-black bg-opacity-50 flex items-center justify-center p-4 w-full h-full"
         >
      <Toaster position={"bottom-right"} />

      <div ref={targetModalRef}  className="bg-white rounded-lg shadow-xl w-full max-w-md h-[60vh] overflow-y-auto z-[200]">
        <div  className="flex justify-between items-center p-6 border-b">
          <h2  className="text-xl font-semibold text-gray-900">Parameters</h2>
          <button onClick={onClose}

            className="text-gray-400 hover:text-gray-500 left-4 "
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className={"p-6 space-y-4"}>
          <input type={"text"} placeholder={"Search Parameters"}  className={"rounded-md p-2 border-2 border-gray-400 text-black"} value={searchValue} onChange={(e) => setSearchValue(e.target.value)}></input>
        </div>
        <div className="p-6 space-y-4">
          <div className={"mb-8"}>
            { searchValue == "" && <p className="text-lg font-semibold text-gray-900 mb-4">Custom Parameters</p>}
            {customParams.map((cp) => {
              if (cp.name.toLowerCase().includes(searchValue.toLowerCase()) || cp.placeholder.toLowerCase().includes(searchValue.toLowerCase())
                  || cp.value.toLowerCase().includes(searchValue.toLowerCase())) {
                return ( <CustomParams  customParams={customParams} setCustomParams={setCustomParams} customParam={cp}></CustomParams>)

              }
            })}

            {isAddingCustomParam &&

                <form className={"p-2 space-y-4 border-2 border-gray-400 rounded-md"}>
                  <label className="block text-md font-medium text-gray-700">
                    Name
                  </label>
                  <input
                      maxLength={100}

                      type="text"
                      value={newCustomParamValue.name}
                      onChange={(e) => {setNewCustomParamValue((prev) => {
                        return {...prev,  name: e.target.value}
                      })}}
                      placeholder={"eg. Target Host"}

                      className="text-black mt-1 block w-full rounded-md p-2 border-gray-200 border-2 shadow-sm focus:border-purple-500 focus:ring-purple-500"

                  />
                  <label className="block text-md font-medium text-gray-700">
                    Placeholder
                  </label>
                  <input
                      maxLength={100}

                      type="text"
                      title={"(Don't add anything here without sorrounding blocks like [], <>, etc or you'll get bad results)"}
                      value={newCustomParamValue.placeholder}
                      onChange={(e) => {setNewCustomParamValue((prev) => {
                        return {...prev,  placeholder: e.target.value}
                      })}}
                      placeholder={"eg. [IP] or <IP> "}

                      className="text-black mt-1 block w-full rounded-md p-2 border-gray-200 border-2 shadow-sm focus:border-purple-500 focus:ring-purple-500"

                  />
                  <label className="block text-md font-medium text-gray-700">
                    Starting Value
                  </label>
                  <input
                      maxLength={100}

                      type="text"
                      value={newCustomParamValue.value}
                      onChange={(e) => {setNewCustomParamValue((prev) => {
                        return {...prev,  value: e.target.value}
                      })}}
                      placeholder={"eg. 10.10.10.10 "}

                      className="text-black mt-1 block w-full rounded-md p-2 border-gray-200 border-2 shadow-sm focus:border-purple-500 focus:ring-purple-500"

                  />

                </form>
            }
            <div>
              {isAddingCustomParam && <button className={"p-2 rounded-md bg-purple-600 mt-4 mr-4 transition hover:bg-purple-800"} onClick={() => {
                if (customParams.length > 1000 ){
                  return toast("Too many Custom Parameters")

                }
                if (customParams.find((cp) => cp.name == newCustomParamValue.name)){
                  return toast("That Custom Parameter Already Exists")
                }
                setCustomParams([...customParams, newCustomParamValue ])
                addCustomParam(newCustomParamValue)
                setNewCustomParamValue({
                  id: new Date().toISOString(),
                  name: "",
                  value: "",
                  placeholder:""
                });
                setIsAddingCustomParam(false)
              }
              }> Submit</button>
              }
              <button className={"p-2 rounded-md bg-purple-600 mt-4 transition hover:bg-purple-800"} onClick={() => setIsAddingCustomParam((prev) => !prev)}> {isAddingCustomParam? "Cancel":"Add New Parameter"}</button>

            </div>


          </div>



          <div className="flex justify-end space-x-3 pt-4">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Exit
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}