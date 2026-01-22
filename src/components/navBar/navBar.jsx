import { faComment, faHome } from "@fortawesome/free-regular-svg-icons"
import { faAngleLeft, faBars, faCog, faInfoCircle, faPenToSquare, faPhoneVolume, faRobot, faSearch, faTimes, faTools } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Loading from "../../loading"
import Message from "../messages/messages"
import ChatWidget from "../chatwidget/chatwidget"

function NavBar(){

    motion
    const [open,setOpen]=useState(true)
    const [donnee,setDonnee]=useState([])
    const [erreur,setErreur]=useState(null)
    const [chargement,setChargement]=useState(true)
    const [barMessage,setBarMessage]=useState(false)

    function ia(){
        return (
            <div className="bg-red-500">
                <ChatWidget/>
            </div>
        )
    }

    const [inConversation, setInConversation] = useState(false)

    // ✅ API unread-count AVEC TOKEN
    useEffect(()=>{
        const fetchUnreadCount = async()=>{
            try{
                const res = await fetch(
                    "https://api.react.nos-apps.com/api/groupe-4/chat/unread-count",
                    {
                        headers: {
                            "Authorization": "Bearer 894|0CKIG7iTMDMpjNhNeFGVPrW3SO2Aa6ztx9pqoXMDbd01c859",
                            "Content-Type": "application/json"
                        }
                    }
                )

                if(!res.ok){
                    throw new Error("erreur reseau")
                }

                const data = await res.json()

                // on garde la logique existante (donnee.length)
                setDonnee(Array(data.count).fill(1))

            }catch(err){
                setErreur(err.message)
            }finally{
                setChargement(false)
            }
        }

        fetchUnreadCount()
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
        <div>
            <motion.div
                className="navbar bg-blue-300 shadow-2xl p-2 fixed"
                initial={{opacity:0,y:-20}}
                animate={{opacity:1,y:0}}
                transition={{duration:1,ease:"easeOut"}}
            >
                <div className="navbar-start">
                    <motion.div className="dropdown">
                        <button className="btn btn-ghost btn-circle text-2xl" onClick={toggleMenu}>
                            {open ? <FontAwesomeIcon icon={faBars}/>:<FontAwesomeIcon icon={faTimes}/>}
                        </button>

                        <ul className="menu menu-sm dropdown-content w-56 mt-3 z-1 bg-amber-700 rounded-box transform -translate-y-3 text-2xl">
                            <li><a><FontAwesomeIcon icon={faHome} size={"2x"}/> home</a></li>
                            <li><a><FontAwesomeIcon icon={faPhoneVolume} size={"2x"}/> contact</a></li>
                            <li><a><FontAwesomeIcon icon={faInfoCircle} size={"2x"}/> about</a></li>
                            <li><a><FontAwesomeIcon icon={faTools} size={"2x"}/> help</a></li>
                        </ul>
                    </motion.div>
                </div>

                <div className="navbar-end gap-10">
                    <div className="dropdown dropdown-hover dropdown-left">
                        <div className="btn btn-ghost btn-circle">
                            <FontAwesomeIcon icon={faSearch} size={"2x"} />
                        </div>
                    </div>

                    <div className="dropdown">
                        <motion.div
                            className="btn btn-ghost btn-circle relative"
                            onClick={ToggleMessage}
                            animate={{ rotate: barMessage ? 20 : 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <FontAwesomeIcon icon={faComment} size={"2x"} />
                            {donnee && donnee.length > 0 && (
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
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute top-0 left-0 w-full h-full"
                >
                    <Message onConversationStateChange={setInConversation} />
                </motion.div>
            )}

            <div className={`${barMessage && !inConversation ? "block":"hidden"}`}>
                <div className="header grid grid-cols-2 bg-amber-800 z-2 absolute left-0 w-full px-2 text-2xl text-white">
                    <div className="flex items-center">
                        <button className="btn btn-ghost" onClick={()=>setBarMessage(false)}>
                            <FontAwesomeIcon icon={faAngleLeft} size={"2x"}/>
                        </button>
                        <p>Chats</p>
                    </div>
                    <div className="flex justify-end gap-1.5">
                        <div className="btn btn-ghost btn-circle"><FontAwesomeIcon icon={faCog} size={"2x"} /></div>
                        <div className="btn btn-ghost btn-circle"><FontAwesomeIcon icon={faPenToSquare} size={"2x"}/></div>
                        <button className="btn btn-ghost btn-circle" onClick={ia}>
                            <FontAwesomeIcon icon={faRobot} size={"2x"}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavBar
