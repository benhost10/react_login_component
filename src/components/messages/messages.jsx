import { faAngleLeft, faCamera,  faImage,  faMicrophone,  faPaperPlane,  faPhone,  faThumbsUp,  faVideoCamera } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"

function Message({ onConversationStateChange }){

    const [donnee,setDonnee]=useState([])
    const [erreur,setErreur]=useState(null)
    const [messageNumber,setMessageNumber]=useState("")
    const [chargement,setChargement]=useState(true)    
    const [selectedUser, setSelectedUser] = useState(null)
    const [userEntry,setUserEntry]=useState("")
    const [userMessages,setUserMessages]=useState([])

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
                        senderName: user ? user.nam : "inconnnu"
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
        return <p>loading...</p>
    }

    const checkEntry=(e)=>{
        setUserEntry(e.target.value)
    }

    // ✅ ENVOI + SAUVEGARDE JSON SERVER
    const sendMessage = async () => {
        if (userEntry.trim() === "") return;

        const newMessage = {
            id: Date.now(),
            content: userEntry,
            senderId: 0,              
            senderName: "Moi",
            receiverName: selectedUser
        };

        // ✅ Ajout local
        setUserMessages([...userMessages, newMessage]);
        setUserEntry("");

        // ✅ Sauvegarde JSON Server
        await fetch("http://172.20.10.3:3001/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMessage)
        });
    };

    const messagesOfUser = donnee.filter(m => m.senderName === messageNumber);

    return(
        <div className=" bg-gray-900 h-full  w-full absolute z-2 mt-10  ">

            {!selectedUser && (
                <h1 className=" z-3 w-full  ">
                    {donnee
                        .map(m => m.senderName)
                        .filter((v, i, arr) => arr.indexOf(v) === i) 
                        .map(nam => (
                            <li 
                                key={nam} 
                                onClick={() => {
                                    setMessageNumber(nam)
                                    setSelectedUser(nam)
                                    onConversationStateChange(true)
                                }} 
                                className="list-none  "
                            >
                                <button className=" btn btn-ghost w-full flex justify-start text-white" >
                                    {nam}
                                </button>
                            </li>
                        ))
                    }
                </h1>
            )}

            {selectedUser && (
                <div className="p-4 w-full absolute left-0 h-full bg-amber-900 overflow-x-hidden flex flex-col">

                    <div className="fixed top-0 grid grid-cols-2 h-16 bg-black w-full left-0 z-4 items-center ">
                        <div className="flex gap-10">
                            <button 
                                className="btn btn-ghost btn-circle"
                                onClick={() => {
                                    setSelectedUser(null)
                                    onConversationStateChange(false)
                                }}
                            >
                                <FontAwesomeIcon icon={faAngleLeft} size={"2x"} color={"blue"} />
                            </button>
                            
                            <h2 className="text-2xl font-bold text-white">
                                 {selectedUser}
                            </h2>
                        </div>
                        <div className="text-white flex gap-2 justify-end">
                            <button className="btn btn-ghost">
                                <FontAwesomeIcon icon={faPhone} size={"2x"} color={"blue"} />
                            </button>
                            <button className="btn btn-ghost">
                                <FontAwesomeIcon icon={faVideoCamera} size={"2x"} color={"blue"} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 text-xl text-white flex-1 w-full overflow-y-scroll pb-20">

                        {/* ✅ messages reçus */}
                        {messagesOfUser.map(msg => (
                            <div key={msg.id} className="chat chat-start">
                                <p className="chat-bubble chat-bubble-primary">
                                    {msg.content}
                                </p>
                            </div>
                        ))}

                        {/* ✅ messages envoyés */}
                        {userMessages
                            .filter(msg => msg.receiverName === selectedUser)
                            .map(msg => (
                                <div key={msg.id} className="chat chat-end">
                                    <p className="chat-bubble chat-bubble-secondary">
                                        {msg.content}
                                    </p>
                                </div>
                            ))
                        }

                    </div>

                    <div className="fixed p-2 bottom-0 flex w-full h-15 bg-black left-0 z-6 items-center gap-1.5 flex-wrap">
                        <button className="btn btn-ghost btn-circle flex-1">
                            <FontAwesomeIcon icon={faImage} color={"blue"} size={"2x"} />
                        </button>
                        <button className="btn btn-ghost btn-circle flex-1">
                            <FontAwesomeIcon icon={faMicrophone} color={"blue"} size={"2x"} />
                        </button>

                        <form className="flex-1" onSubmit={(e)=>{e.preventDefault(); sendMessage();}}>
                            <textarea
                              className="rounded-xl w-44 resize-none bg-white placeholder place-content-center"
                              placeholder="Aa"
                              onChange={checkEntry}
                              value={userEntry}
                              rows={2}
                            />
                        </form>

                        <button className="btn btn-ghost text-white flex-1" onClick={sendMessage}>
                            {userEntry==="" ? 
                              <FontAwesomeIcon icon={faThumbsUp} color={"blue"} size={"2x"} /> :
                              <FontAwesomeIcon icon={faPaperPlane} color={"blue"} size={"2x"} />
                            }
                        </button>
                        <button className="btn btn-ghost btn-circle flex-1">
                            <FontAwesomeIcon icon={faCamera} color={"blue"} size={"2x"} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Message
