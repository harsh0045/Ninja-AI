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
       const {prompt,amount="1",resolution="512x512"}=body;

       const instructionMessage : string="You must create each time different image than previous"
       
       if(!userId){
        return new NextResponse("Unauthorized",{status:401});
       }
      
       if(!prompt){
        return new NextResponse("Messages are required",{status:400});
       }
       if(!amount){
        return new NextResponse("Amount are required",{status:400});
       }
       if(!resolution){
        return new NextResponse("Resolutions are required",{status:400});
       }
       
       const freeTrial = await checkApiLimit();
             const isPro = await getSubscriptionStatus();
             if(!freeTrial && !isPro){
                return new NextResponse("Free Trial has expired",{status:403});
      
             }
       const length=parseFloat(amount);
     
       const blobs = await Promise.all(
         Array.from({ length:length}).map(async() => {
          const result = await hf.textToImage({
            model: process.env.IMAGE_MODEL_URL,
            inputs: instructionMessage+prompt,
            parameters: { 
              num_inference_steps: 5,
            },
            provider: "hf-inference",
          })
         
          return result;
         }
          
         )
       );
   
       const imageBuffers = await Promise.all(blobs.map(async (blob) => {
         const buffer = await blob.arrayBuffer();
         return Buffer.from(buffer).toString("base64");
       }));
      
     if(!isPro) await increaseApiLimit();
       return NextResponse.json({ 
         images: imageBuffers.map((img) => `data:image/png;base64,${img}`) 
       });
   

    }catch(error){
        console.log("[IMAGE_ERROR]",error);
        return new NextResponse("Internal Error",{status:500});
    }
  

}
