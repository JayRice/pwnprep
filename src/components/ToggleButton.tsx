import {ChevronRightCircle, ChevronLeftCircle} from "lucide-react"
interface ToggleProps{
    isToggled: boolean;
    setIsToggled: (toggled: boolean) => void;
    className: string;
}
export default function ToggleButton({isToggled,setIsToggled, className } : ToggleProps) {
    const classNames = "w-full h-full bg-purple-600 text-white rounded-full"
    return (
        <div className={"fixed top-[50vh] z-50  rounded-full w-8 h-8 position-transition " + className}>
            <button className={"w-full h-full "} onClick={() => setIsToggled(!isToggled)}>
                {isToggled ? <ChevronRightCircle className={classNames}/> : <ChevronLeftCircle className={classNames}/>}
            </button>
        </div>
    )
}
