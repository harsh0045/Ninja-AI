import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai"

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,

})

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
       if(!freeTrial){
          return new NextResponse("Free Trial has expired",{status:403});

       }
     

       const completion = await openai.chat.completions.create({
        model: "openai/gpt-3.5-turbo",
        messages
      })

      await increaseApiLimit();
      
    
     return NextResponse.json(completion.choices[0].message);
    }catch(error){
        console.log("[CONVERSATION_ERROR]",error);
        return new NextResponse("Internal Error",{status:500});
    }
  


}
