import {useRef} from "react"

interface Props{
    confirming_reason: string;
    confirm_callback: () => void;
    cancel_callback: () => void;
    description?: string;

}
export default function ConfirmationModal({confirming_reason, confirm_callback, cancel_callback, description="You cannot reverse this action"}: Props) {

    const confirmationModalRef = useRef<HTMLDivElement>(null);

    return (
        <div className="fixed inset-0 z-[1000] bg-black bg-opacity-50 flex items-center justify-center p-4 w-full h-full">
            <div ref={confirmationModalRef}  className="bg-white rounded-lg shadow-xl w-full max-w-md h-[60vh] flex flex-col p-16 items-center">

                <h1 className={"text-2xl relative text-center"}> Are you sure you want to <br></br><span className={"text-red-600 font-bold text-3xl"}>{confirming_reason}</span>?</h1>

                <p className={"text-md relative top-8 text-center"}>{description}</p>
                <div className={"absolute flex flex-row w-full  top-[70%]  gap-4  justify-center"}>
                    <button onClick={confirm_callback} className={"flex items-center justify-center   h-12 text-white font-bold bg-red-600 hover:bg-red-800 p-4 transition-colors"}>Confirm</button>
                    <button onClick={cancel_callback} className={"flex items-center justify-center  h-12 border-2 border-black hover:bg-gray-800 hover:text-white p-4 transition-colors "}>Cancel</button>

                </div>

            </div>
        </div>
    )
}