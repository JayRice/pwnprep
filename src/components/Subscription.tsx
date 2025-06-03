import {useState} from "react"
interface Props {
    user: User | null
}

export default function SubscribeForm ({ user }: Props) {
    const [isDisabled, setIsDisabled] = useState(false);

    const handleClick = () => {
        setIsDisabled(true);
        // do something...
    };


    if (!user) {
        return <div className={"text-center text-3xl"}>Log in</div>
    }

    const handleSubscribe = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/create-checkout-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: user.email,
                priceId: import.meta.env.VITE_PRICE_KEY,
                userId: user.uid
            }),
        });

        const { url } = await res.json();
        console.log(url)
        window.location.href = url;
    };

    return (
        <form className={"flex"}  >
            <button   disabled={isDisabled}
                      onClick={(e) =>
                      {
                          handleClick()
                          e.preventDefault();
                          handleSubscribe();
                      }} type="submit" className={"text-white p-2 rounded-lg w-full h-16 text-2xl " + (isDisabled ? "bg-purple-900 cursor-not-allowed":"bg-purple-600 hover:bg-purple-800")}>{isDisabled ? "Redirecting":"Subscribe"}</button>
        </form>
    );
};
