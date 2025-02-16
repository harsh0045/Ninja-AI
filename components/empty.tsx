import Image from "next/image"

interface EmptyProps {
    label:string;
}
const Empty = ({label}:EmptyProps) => {
  return (
    <div className="   flex flex-col items-center">
        <div className="relative h-64 w-64 -ml-8">
           <Image 
             alt="Empty"
             fill
             src="/empty.png"
             />  
        </div>
        <p className="text-muted-foreground text-sm text-center">
              {label}
        </p>
    </div>
  )
}

export default Empty