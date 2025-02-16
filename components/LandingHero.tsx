"use client"
import { useAuth } from "@clerk/nextjs"
import Link from "next/link"
import {Typewriter } from "react-simple-typewriter"
import { Button } from "./ui/button"

const LandingHero = () => {
    const {isSignedIn} = useAuth();
  return (
     <div className="text-white font-bold py-36 text-center space-y-5">
         <div className="text-4xl sm:text-5xl md:text-6xl  space-y-5 font-extrabold">
             <h1>The Best AI Tool for</h1>
             <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
             <Typewriter
            words={['Chatbot.', 'Photo Generation.', 'Music Generation.', 'Code Generation.','Video Generation.']}
            loop={true}
            cursor
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1000}
          />
             </div>
         </div>
         <div className="text-sm md:text-xl font-light text-zinc-400">
             Create content using AI 10x faster.
         </div>
         <div className="">
             <Link href={isSignedIn? "/dashboard":"/signup"}>
                <Button variant="premium" className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
                     Start Genearating For Free
                </Button>
             </Link>
         </div>
         <div className="text-zinc-400 text-xs md:text-sm font-normal">
              No credit card required.
         </div>
     </div>
  )
}

export default LandingHero