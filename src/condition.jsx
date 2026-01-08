import { useEffect, useRef, useState } from "react"

export default function Condition(){

    const [check,setChecked]=useState(false)

    const toggleElement=()=>{
        setChecked(!check)

    }

    // const ref=useRef(null)

    // useEffect(()=>{
    //     console.log(ref.current.offsetHeight)
    // },[])



    

    

    return (
        <div >
            
            <form action="" className="p-3">
                <input type="checkbox" className="checkbox checkbox-primary" onClick={toggleElement}/> 
                
                 <span> accepter les termes et conditions d'utilisation</span>

            </form>
            <button className={`btn ${check ? "btn-primary":"btn-disabled"} `}>suivant</button>
            {/* <form action="" >
                <label >
                    <input type="text" className="input input-primary placeholder-primary" placeholder="enter something"  />
                </label>
            </form> */}
            

        </div>
    )
}