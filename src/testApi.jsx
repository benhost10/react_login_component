import { useEffect, useState } from "react"

export default function TestApi(){
    const [data,setData]=useState([])
    const [error,setError]=useState(null)
    const [loading,setLoading]=useState(true)

    useEffect(()=>{
        const request=async ()=>{
            try{
                const response=await fetch("https://api.react.nos-apps.com/api/groupe-4/feed")
                if(!response.ok){
                    throw new Error("erreur reseau")
                    // setError(Error.name)
                }
                
                const jsonn=await response.json()
                setData(jsonn)

            }
            catch(e){
                setError(e.message)
            }
            finally{
                setLoading(false)
            }
        }
        request()
    },[])

    if(error){
        return <p>{error} </p>
    }
    if(loading){
        return <p>chargement...</p>
    }
    



    return (
        <div>
            {data.map((msg)=>(
                <li key={msg.id}>
                    {msg.id==21? `${msg.contenu} ` :""}
                    {/* {msg.lastMessage} */}
                </li>
            ))}
            
        </div>
    )
}