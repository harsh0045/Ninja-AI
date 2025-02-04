"use client";

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from './ui/card';
import { MAX_FREE_COUNTS } from '@/constants';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Zap } from 'lucide-react';
import { useProModal } from '@/hooks/user-pro-modal';


interface FreeCounterProps {
    apiLimitCount:number;
}


const FreeCounter = ({apiLimitCount}:FreeCounterProps) => {
    const proModal= useProModal();

    const [mounted,setMounted]=useState(false);
    useEffect(()=>{
        setMounted(true);
    },[]);
    if(!mounted)return null;
  return (
    <div className='px-3 '>
        <Card className='bg-white/10 border-0 '>
            <CardContent className='py-4'>
                 <div className='text-center text-sm text-white mb-4 space-y-2'>
                     <p>
                        {apiLimitCount}/{MAX_FREE_COUNTS} Free Generations
                     </p>
                     <Progress 
                       className='h-2  bg-white/70'
                       value={(apiLimitCount/MAX_FREE_COUNTS)*100}
                       />
                 </div>
                 <Button onClick={proModal.onOpen} variant="premium" className='w-full mb-3'>
                     Upgrade
                     <Zap className='w-4 h-4 ml-2 fill-white'/>
                 </Button>
            </CardContent>
        </Card>
    </div>
  )
}

export default FreeCounter