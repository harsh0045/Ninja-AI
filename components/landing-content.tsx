"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const testimonials = [
    {
        name:"Harshita",
        avatar:"H",
        title:"Software Engineer",
        description:"This is the best application I've used!"
    },
    {
        name:"Anmol",
        avatar:"A",
        title:"Software Engineer",
        description:"Really surprise with the smooth and fast work of this website!"
    },
    {
        name:"Stuart",
        avatar:"S",
        title:"Software Engineer",
        description:"Wonderfull Experience Recommending all the first time user to use this website without any worry."
    },
    {
        name:"Zuckerberg",
        avatar:"Z",
        title:"Software Engineer",
        description:"Just go for it.It is one of the best website which organize your work in efficient manner."
    }
]

const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
        <h2 className="text-center text-4xl text-white font-extrabold mb-10">
           Testimonials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {testimonials.map((item)=>(
                <Card key={item.description} className="bg-[#192339] border-none text-white">
                      <CardHeader>
                         <CardTitle className="flex items-center gap-x-2">
                             <div>
                                <p className="text-lg">{item.name}</p>
                                <p className="text-zinc-400 text-sm" >{item.title}</p>
                             </div>
                         </CardTitle>
                         <CardContent className="p-4 px-0">
                            {item.description}
                         </CardContent>
                      </CardHeader>
                </Card>
            ))}

        </div>
    </div>
  )
}

export default LandingContent