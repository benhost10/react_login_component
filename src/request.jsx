import { useEffect, useState } from "react"
import Loading from "./loading"
// import Loading from "./loading"

function Reequest(){
   const[data,setData]=useState(null)
//    const [error,setError]=useState(null)
//    const [loading,setLoading]=useState(true)


   useEffect(()=>{
    const DataFetch=async()=>{
        // try{
            const response=await fetch(
                "https://api.react.nos-apps.com/api/groupe-4/feed",
                {
                    method:"GET",
                    headers:{
                        "content-type":"application/json",
                        "accept":"application/json"
                    }
                }
            )
            // if(!response.ok){
            //     throw new Error("erreur reseau")

            // }
            
            const json=await response.json()
            setData(json)
            

        // }catch(err){
        //     setError(err.message)
        // }
        // finally{
        //     setLoading(false)
        // }
        
    }
    DataFetch() 
   },[])

    // if(loading){
    //     return <Loading/>
        
    // }
    // if(error){
    //     return <p>erreur:{error} </p>
    // }
    console.log(data)



    return(
        <div>
            <h1>bonjour tout le monde</h1>
            <ul className="flex">
                {data.map((photo)=>(
                    <li key={photo.id}>
                        <div className="w-60 shadow-2xl bg-base-200 ">
                            <figure>
                                {/* <img src={photo.thumbnailUrl} alt={photo.title} /> */}
                                {/* <img src={`https://picsum.photos/200?random=${photo.id}`} /> */}

                            </figure>
                            <div className="card-body">
                                <div className="card-title">{photo.image} </div> 
                                <div className="card-actions">click me</div>

                            </div>
                        </div>
                    </li>
                ))}










                
            </ul>
        

        </div>
    )
}

export default Reequest