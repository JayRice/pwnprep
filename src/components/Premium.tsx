import SubscribeForm from "./Subscription.tsx"
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {Check} from "lucide-react"
interface Props {
  user: User | null
}

function Premium({user} : Props) {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 ">
      <div className="max-w-lg mx-auto ">
        <div className="">
          <div className="bg-white rounded-lg shadow p-6 flex   flex-col gap-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Upgrade to Premium ($5/month)</h2>
            <p className="text-xl text-gray-600 text-center">
              Access exclusive features and advanced capabilities with our premium subscription.
            </p>
            <div className="flex flex-row gap-2 items-center">

              <Check className="w-5 h-5 shrink-0"/>
              <p>Get access to <span className={"text-purple-600 font-bold uppercase"}>all commands</span> and tips for the EJPT, CPTS, OSCP, and future certification tests.</p>
            </div>
            <div className="flex flex-row gap-2 items-center">

              <Check className="w-5 h-5 shrink-0"/>
              <p>Get access to <span className={"text-purple-600 font-bold uppercase"}>unlimited AI</span> uses to explain and organize your notes</p>
            </div>
            <div className="flex flex-row gap-2 items-center">

              <Check className="w-5 h-5 shrink-0"/>
              <p>Automatically get access to the future <span className={"text-purple-600 font-bold uppercase"}>Premium+</span> plan with improved functionality, more commands for tests, and custom AI note organization.</p>
            </div>

            <p className={" font-bold capitalize text-center"}>Unleash your full cybersecurity note taking abilities now and subscribe:</p>
            <Elements stripe={stripePromise}>
              <SubscribeForm user={user}/>
            </Elements>
          </div>
          <p className={"font-light text-center mt-2"}> Powered by <span className={"text-purple-600 font-bold"}>Stripe</span></p>
        </div>
      </div>
    </div>
  );
}

export default Premium;