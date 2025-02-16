import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

import { HfInference } from "@huggingface/inference";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import axios from "axios";

const getSubscriptionStatus = async () => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription`);
  return data.isPro;
};

const hf = new HfInference(process.env.HF_API_TOKEN);


export async function POST(req:Request) {
    try{
       const {userId}=await auth();
       const body= await req.json();
       const {prompt}=body;


       if(!userId){
        return new NextResponse("Unauthorized",{status:401});
       }
      
       if(!prompt){
        return new NextResponse("Messages are required",{status:400});
       }
      
    
     const freeTrial = await checkApiLimit();
      const {isPro} = await getSubscriptionStatus();
      if(!freeTrial && !isPro){
        return new NextResponse("Free Trial has expired",{status:403});

      }
    const result = await hf.textToSpeech({
      model: process.env.MUSIC_MODEL_URL,
      inputs: prompt,
      provider: "hf-inference",
    })
    const buffer = await result.arrayBuffer();
    const base64Audio = Buffer.from(buffer).toString("base64");
     
    if(!isPro) await increaseApiLimit();

    return NextResponse.json({
      audio: `data:audio/wav;base64,${base64Audio}`,
    });
    }catch(error){
        console.log("[MUSIC_ERROR]",error);
        return new NextResponse("Internal Error",{status:500});
    }
  

}
