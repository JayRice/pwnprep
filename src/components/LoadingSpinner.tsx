export default function LoadingSpinner({parentClassName="", spinnerClassName=""} : {parentClassName?: string; spinnerClassName?: string;}){

    return (
    <div className={"flex justify-center " + parentClassName}>
        <div className={"w-8 h-8 border-4 border-t-transparent rounded-full animate-spin "+spinnerClassName} />
    </div>
)};