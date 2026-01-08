import { faComment, faHome } from "@fortawesome/free-regular-svg-icons"
import { faAngleLeft, faBars, faCog, faInfoCircle, faPenToSquare, faPhoneVolume, faSearch, faTimes, faTools } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {  motion  } from "framer-motion"
import { useEffect, useState } from "react"
import Loading from "../../loading"
import Message from "../messages/messages"

function NavBar(){
    motion
    const [open,setOpen]=useState(true)
    const [donnee,setDonnee]=useState([])
    const [erreur,setErreur]=useState(null)
    const [chargement,setChargement]=useState(true)
    const [barMessage,setBarMessage]=useState(false)

    // ✅ NOUVEAU : savoir si on est dans une conversation
    const [inConversation, setInConversation] = useState(false)

    useEffect(()=>{
        const Requet=async()=>{
            try{
                const users=await fetch("http://192.168.100.186:3001/users")
                const msgs=await fetch("http://192.168.100.186:3001/messages")
                
                if(!users.ok && !msgs.ok){
                    throw new Error("erreur reseau")
                }
                const json=await users.json()
                const dataload=await msgs.json()

                const associated=dataload.map((datas)=>{
                    const user = json.find(u => Number(u.id) === Number(datas.senderId))
                    return {
                        ...datas,
                        senderName: user ? user.name : "inconnnu"
                    }
                })

                setDonnee(associated)
                
            }
            catch(err){
                setErreur(err.message)
            }
            finally{
                setChargement(false)
            }
            
        }
        Requet()
    },[])

    if(erreur){
        return <p>erreur: {erreur}</p>
    }
    if(chargement){
        return <Loading/>
    }

    function toggleMenu(){
        setOpen(!open)
    }

    function ToggleMessage(){
        setBarMessage(!barMessage)
    }

    return(
        <div >
            <motion.div className="navbar bg-blue-300 shadow-2xl p-2 fixed "initial={{opacity:0,y:-20}}
                animate={{opacity:1,y:0}}
                transition={{duration:1,ease:"easeOut"}}>
                <div className="navbar-start">
                    <motion.div className="dropdown ">
                        <button role="button" tabIndex={0} className="btn btn-ghost btn-circle text-2xl " onClick={toggleMenu} >
                            {open ? <FontAwesomeIcon icon={faBars}/>:<FontAwesomeIcon icon={faTimes}/>}
                        </button>
                        <ul className="menu menu-sm dropdown-content w-56 mt-3 z-1 bg-amber-700
                            rounded-box transform -translate-y-3 text-2xl" >
                            <li className="hover:text-white"><a href="#"><FontAwesomeIcon icon={faHome} size={"2x"}/>  
                                <span className="text-2xl">home</span> </a></li>
                            <li className="hover:text-white"><a href="#"><FontAwesomeIcon icon={faPhoneVolume} size={"2x"}/>
                                <span className="text-2xl">contact</span>  </a></li>
                            <li className="hover:text-white"><a href="#"><FontAwesomeIcon icon={faInfoCircle} size={"2x"}/>
                                <span className="text-2xl">about</span>   </a></li>
                            <li className="hover:text-white"><a href="#"><FontAwesomeIcon icon={faTools}size={"2x"}/>
                                <span className="text-2xl">help</span>  </a></li>
                        </ul>
                    </motion.div>
                </div>
                <div className="navbar-end gap-10">
                    <div className="dropdown dropdown-hover dropdown-left">
                        <div className="btn btn-ghost btn-circle shadow-accent-content "><FontAwesomeIcon icon={faSearch} size={"2x"}/> </div>
                        <ul tabIndex={1} className="menu menu-sm dropdown-content dropdown-left w-56">
                            <form action="#" className="flex">
                                <input type="search" className="input input-primary placeholder-accent"placeholder="search" />
                                <button className="btn btn-primary">search</button>
                            </form>
                        </ul>
                    </div>
                    <div className="dropdown  ">
                        <motion.div className="btn btn-ghost btn-circle relative"onClick={ToggleMessage}
                        
                         animate={{ rotate: barMessage ? 20 : 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        
                        >
                            <FontAwesomeIcon icon={faComment} size={"2x"} />
                            {donnee && donnee.length>0 &&(
                                <span className="absolute top-0 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
                                    {donnee.length}
                                </span> 
                            )}
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {barMessage && (
                <motion.div
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute top-0 left-0 w-full h-full"
                >
                    {/* ✅ on passe l'état à Message */}
                    <Message onConversationStateChange={setInConversation} />
                </motion.div>
            )}

            {/* ✅ bouton flèche NavBar visible seulement dans la LISTE des messages */}
            <div className={`${barMessage && !inConversation ? "block":"hidden"} `}>
                <div className="header grid grid-cols-2 bg-amber-800 z-2 absolute left-0 w-full overflow-hidden px-2 text-2xl text-white ">
                    <div className="flex justify-start items-center">
                        <button className=" btn btn-ghost  " onClick={()=>setBarMessage(false)}>
                            <FontAwesomeIcon icon={faAngleLeft} size={"2x"}/>
                            
                        </button>
                        <p>Chats</p>
                    </div>
                    <div className="flex justify-end gap-1.5 text-white">
                        <div className="btn btn-ghost btn-circle"><FontAwesomeIcon icon={faCog} size={"2x"} /></div>
                        <div className="btn btn-ghost btn-circle"><FontAwesomeIcon icon={faPenToSquare} size={"2x"}/></div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default NavBar
