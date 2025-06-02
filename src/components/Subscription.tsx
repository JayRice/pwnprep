import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

interface Props {
    user: User | null
}

export default function SubscribeForm ({ user }: Props) {
    const stripe = useStripe();

    if (!user) {
        return <div>Log in</div>
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
        <form onSubmit={(e) => { e.preventDefault(); handleSubscribe(); }}>
            <button type="submit" >Subscribe</button>
        </form>
    );
};
