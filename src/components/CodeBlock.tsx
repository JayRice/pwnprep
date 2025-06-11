import React, {useRef, useEffect} from 'react';
import { Copy, Check, Sparkles  } from 'lucide-react';
import toast from 'react-hot-toast';

import { replaceParams, revertParams } from "../regex/regex.ts"
import {useStore} from "../store/useStore.ts";






interface CodeBlockProps {
  code: string;
  inChat?: boolean;
  refactoredCode?: string;
  language?: string;
  interactive?: boolean;
  updateCodeContent?: (id: string, value:string) => void;
  className? : string;
  id?: string;
  onContextMenu?: (e : never) => void ;
  inNotes: boolean;
  closeParent?: () => void;
}

export default function CodeBlock({ code, inChat = false, language = 'bash', interactive=false, inNotes=false, className="", id="", refactoredCode="",
                                      updateCodeContent=() => console.log("Update CB Failed! No function."),
                                      onContextMenu=() => console.log("ContextMenu Failed! No function."),
                                      closeParent=() : void => {}
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const [changingCode, setChangingCode] = React.useState(code);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  const customParamsChanged = useStore(
      (state) => state.customParamsChanged
  );

  const isPremium = useStore((state) => state.isPremium);

  const [isSendingAIMessage, setIsSendingAIMessage] = React.useState(false);
  const [AIMessage, setAIMessage] = React.useState("");



  useEffect(() => {
    replaceParams(code).then((code) => {
      setChangingCode(code);
    });
  }, [])
  useEffect(() => {

      console.log("Changed: ", code);
      replaceParams(code).then((changedCode) => {
        setChangingCode(changedCode);

      });



  }, [customParamsChanged])
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(await replaceParams(code));
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch  {
      toast.error('Failed to copy code');
    }
  };

    const classNames = "relative group " + className

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    setChangingCode(value);
    if(inNotes){
      updateCodeContent(id, value);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      replaceParams(value).then((code) => {
        setChangingCode(code);
      });
    }, 1000);
  };
  return (
    <div key={id} className={classNames} onContextMenu={onContextMenu}   >
      <pre className={`language-${language} bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto`}>
        <code>
            {(interactive && inNotes) &&
                (<textarea
                    value={changingCode}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    className={"bg-gray-900 text-gray-100 w-full"} maxLength={1000}

                    onChange={handleCodeChange} placeholder={"Change Code here!"}></textarea>)
            }
            {(interactive && !inNotes) &&
                (<textarea
                    value={changingCode}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    className={"bg-gray-900 text-gray-100 w-full"} maxLength={1000}
                    onChange={handleCodeChange}
                    ></textarea>)
            }

            {(!interactive) && code}


        </code>
      </pre>

        <div className={""}>
            <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-2 rounded-md bg-gray-800 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Copy to clipboard"
            >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>

            {!inChat && <button

                className="absolute top-2 right-12 p-2 rounded-md bg-gray-800 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Explain this to me"
                onClick={() => {
                  if(!isPremium) {
                    return toast("You have to be premium to access this feature!")
                  }
                  if (code.trim() == ""){
                    return toast("No code to query.")
                  }
                  setIsSendingAIMessage((prev) => !prev);
                }}
            >
                <Sparkles  className="h-4 w-4" />

            </button>}
          {isSendingAIMessage && <div  onKeyDown={(e) => {
            if (e.key === "Enter") {

              const setStoreAIMessage = useStore.getState().setAIMessage;
              setStoreAIMessage(AIMessage + `: "${code}"`)

              setAIMessage("")
              setIsSendingAIMessage(false)

              if(closeParent){
                closeParent()
              }
            }
          }} className={"absolute top-16 w-full h-16 rounded-md p-2 bg-gray-600 text-gray-300"}>
            <input className={"w-full h-full rounded-md bg-gray-800"} value={AIMessage} onChange={(e) => {
              setAIMessage(e.target.value)
            }} placeholder={"What do you wanna ask about this?"}></input>
          </div>}

        </div>


    </div>
  );
}