import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";

import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { NextResponse } from "next/server";
import OpenAI from "openai"
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";


const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,

})

const instructionMessage : ChatCompletionMessageParam={
  role:"system",
  content:"You are a code generator.You must answer code only in markdown code snippets and must answer explanation part of the code line by line with complete depth understanding below the complete code not necessarily in markdown."
}

const getSubscriptionStatus = async () => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription`);
  return data.isPro;
};

export async function POST(req:Request) {
    try{
       const {userId}=await auth();
       const body= await req.json();
       const {messages}=body;

       if(!userId){
        return new NextResponse("Unauthorized",{status:401});
       }
       if(!openai.apiKey){
         return new NextResponse("OpenAI API Key not configured",{status:500});
       }
       if(!messages){
        return new NextResponse("Messages are required",{status:400});
       }
       
        const freeTrial = await checkApiLimit();
        const isPro = await getSubscriptionStatus();
        if(!freeTrial && !isPro){
            return new NextResponse("Free Trial has expired",{status:403});

        }
       const completion = await openai.chat.completions.create({
        model: "openai/gpt-3.5-turbo",
        messages:[instructionMessage,...messages]
      })
      if(!isPro)await increaseApiLimit();
     return NextResponse.json(completion.choices[0].message);
    }catch(error){
        console.log("[CODE_ERROR]",error);
        return new NextResponse("Internal Error",{status:500});
    }
  

}
