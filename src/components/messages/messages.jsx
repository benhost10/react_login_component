import { faAngleLeft, faCamera, faCog, faImage, faInfoCircle, faMicrophone, faPaperPlane, faPenToSquare, faPhone, faRobot, faThumbsUp, faVideoCamera } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef, useState } from "react"
import ChatWidget from "../chatwidget/chatwidget"

// ✅ Fonction pour récupérer le token dynamiquement
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken') || "1658|82Syi5G2bhZ8RiJXDFY51eWEwA9cypmCcP1Kt2uE8d33bcd1"
    
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    }
}

function Message({ onConversationStateChange, onClose }){

    const [donnee,setDonnee]=useState([])
    const [erreur,setErreur]=useState(null)
    const [chargement,setChargement]=useState(true)    
    const [selectedUser, setSelectedUser] = useState(null)
    const [userEntry,setUserEntry]=useState("")
    const [userMessages,setUserMessages]=useState([])

    const [isInCall, setIsInCall]=useState(false)
    const videoRef=useRef(null)
    
    // ✅ Référence WebSocket
    const wsRef = useRef(null)
    // ✅ Référence pour l'intervalle de polling
    const pollingRef = useRef(null)

    const callingVideo=async()=>{
        try{
            const stream=await navigator.mediaDevices.getUserMedia({
                video:true,
                audio:true
            })
            setIsInCall(!isInCall)
            setTimeout(()=>{
                if(videoRef.current){
                    videoRef.current.srcObject=stream
                }
            },1000)

        }catch (e){
            alert("erreur:",e)
        }
    }

    // ✅ CHARGEMENT DES CONVERSATIONS
    const fetchConversations = async () => {
        try{
            const res = await fetch(
              "https://api.react.nos-apps.com/api/groupe-4/chat/conversations",
              { headers: getAuthHeaders() }
            )
            if(!res.ok) throw new Error("erreur reseau")
            const data = await res.json()
            setDonnee(data)
        }catch(err){
            console.error("Erreur conversations:", err)
            setErreur(err.message)
        }
    }

    useEffect(()=>{
        const init = async () => {
            try {
                await fetchConversations()
            } finally {
                setChargement(false)
            }
        }
        init()

        // ✅ POLLING : Rafraîchir les conversations toutes les 5 secondes
        // C'est une alternative simple au WebSocket pour recevoir les nouveaux messages
        pollingRef.current = setInterval(() => {
            fetchConversations()
        }, 5000) // Toutes les 5 secondes

        // Nettoyage
        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current)
            }
        }
    },[])

    // ✅ CHARGEMENT DES MESSAGES
    const fetchMessages = async (conversationId, userObject) => {
        try {
            console.log("📡 Chargement des messages pour:", conversationId)
            
            const res = await fetch(
              `https://api.react.nos-apps.com/api/groupe-4/chat/messages/${conversationId}`,
              { headers: getAuthHeaders() }
            )
            
            if (!res.ok) {
                const errorText = await res.text()
                console.error(`❌ Erreur HTTP ${res.status}:`, errorText)
                throw new Error(`Erreur HTTP ${res.status}`)
            }
            
            const textResponse = await res.text()
            const data = JSON.parse(textResponse)
            
            let messages = []
            
            if (Array.isArray(data)) {
                messages = data
            } else if (data.data && Array.isArray(data.data)) {
                messages = data.data
            } else if (data.messages && Array.isArray(data.messages)) {
                messages = data.messages
            } else if (data.id && data.message) {
                messages = [data]
            } else {
                messages = []
            }
            
            const otherUserId = userObject?.user?.id || userObject?.id
            
            const messagesWithOwnership = messages.map(msg => {
                const isMine = msg.receiver_id === otherUserId
                return {
                    ...msg,
                    isMine: isMine
                }
            })
            
            setUserMessages(messagesWithOwnership)
            
            // Marquer comme lu
            try {
                await fetch(
                  `https://api.react.nos-apps.com/api/groupe-4/chat/messages/${conversationId}/read`,
                  {
                    method: "POST",
                    headers: getAuthHeaders()
                  }
                )
            } catch (readErr) {
                console.error("Erreur marquage comme lu:", readErr)
            }
            
            // Rafraîchir les conversations
            await fetchConversations()
        } catch (err) {
            console.error("Erreur complète:", err)
            alert("Erreur lors du chargement des messages: " + err.message)
        }
    }

    // ✅ Polling des messages quand une conversation est ouverte
    useEffect(() => {
        let messagePolling = null
        
        if (selectedUser) {
            // Rafraîchir les messages toutes les 3 secondes
            messagePolling = setInterval(() => {
                const conversationId = selectedUser.id || selectedUser.user?.id
                if (conversationId) {
                    fetchMessages(conversationId, selectedUser)
                }
            }, 3000)
        }
        
        return () => {
            if (messagePolling) {
                clearInterval(messagePolling)
            }
        }
    }, [selectedUser])

    if(erreur){
        return <p>erreur: {erreur}</p>
    }
    if(chargement){
        return <p>loading...</p>
    }

    const checkEntry=(e)=>{
        setUserEntry(e.target.value)
    }

    const sendMessage = async () => {
        if (userEntry.trim() === "") return

        const messageToSend = userEntry.trim()

        const tempMessage = {
            id: Date.now(),
            content: messageToSend,
            message: messageToSend,
            isMine: true
        }

        setUserMessages([...userMessages, tempMessage])
        setUserEntry("")

        try {
            const receiverId = selectedUser.user?.id
            
            if (!receiverId) {
                alert("Erreur: Impossible de trouver le destinataire")
                setUserMessages(prevMessages => prevMessages.filter(msg => msg.id !== tempMessage.id))
                return
            }

            const requestBody = {
                receiver_id: receiverId,
                message: messageToSend
            }

            const res = await fetch(
                "https://api.react.nos-apps.com/api/groupe-4/chat/send",
                {
                    method: "POST",
                    headers: getAuthHeaders(),
                    body: JSON.stringify(requestBody)
                }
            )

            const responseText = await res.text()

            if (!res.ok) {
                throw new Error(`Erreur HTTP ${res.status}: ${responseText}`)
            }

            const data = JSON.parse(responseText)
            console.log("✅ Message envoyé avec succès:", data)

            const conversationId = selectedUser.id || selectedUser.user?.id
            await fetchMessages(conversationId, selectedUser)

        } catch (err) {
            console.error("Erreur envoi:", err)
            setUserMessages(prevMessages => prevMessages.filter(msg => msg.id !== tempMessage.id))
        }
    }

    // ✅ CORRECTION : Fonction pour fermer COMPLÈTEMENT la page des messages
    const handleCloseMessages = () => {
        setSelectedUser(null)
        setUserMessages([])
        onConversationStateChange(false)
        // ✅ Cette ligne était manquante : elle ferme la modale/page entière
        if (onClose) {
            onClose()
        }
    }

    return(
        <div className="h-full md:w-90 absolute z-2 w-full" 
        style={{
                background: "linear-gradient(to bottom, #ec4899, #8b5cf6)"
            }}
        >
            {/* ✅ Navbar avec bouton retour qui ferme TOUT */}
            {!selectedUser && (
                <div className="header grid grid-cols-2 bg-violet-600 z-10 fixed top-0 left-0 w-full md:w-90 px-2 py-3 text-2xl text-white">
                    <div className="flex items-center">
                        <button className="btn btn-ghost" onClick={handleCloseMessages}>
                            <FontAwesomeIcon icon={faAngleLeft} size={"2x"}/>
                        </button>
                        <p>Chats</p>
                    </div>
                    <div className="flex justify-end gap-1.5">
                        <div className="btn btn-ghost btn-circle">
                            <FontAwesomeIcon icon={faCog} size={"2x"} />
                        </div>
                        <div className="btn btn-ghost btn-circle">
                            <FontAwesomeIcon icon={faPenToSquare} size={"2x"}/>
                        </div>
                        <button className="btn btn-ghost btn-circle">
                            <FontAwesomeIcon icon={faRobot} size={"2x"}/>
                        </button>
                    </div>
                </div>
            )}

            {!selectedUser && (
                <h1 className="z-3 w-full mt-20">
                    {donnee.map((conv, index) => (
                        <li 
                            key={conv.id || conv.user?.id || index}
                            className="list-none"
                            onClick={() => {
                                const conversationId = conv.id || conv.user?.id
                                
                                console.log("✅ ID final utilisé:", conversationId)
                                setSelectedUser(conv)
                                fetchMessages(conversationId, conv)
                                onConversationStateChange(true)
                            }}
                        >
                            <button className="btn btn-ghost w-full flex flex-col items-start text-white relative py-4 h-auto">
                                <div className="w-full flex justify-between items-center">
                                    <span className="font-bold text-lg">{conv.user?.name || "Utilisateur"}</span>
                                    
                                    {conv.unread_count > 0 && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                            <span className="badge badge-error badge-sm text-white font-bold">
                                                {conv.unread_count}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                {conv.last_message && (
                                    <div className="w-full flex items-center gap-2 mt-1">
                                        <span className={`text-sm ${conv.unread_count > 0 ? 'font-semibold text-white' : 'text-gray-300 opacity-80'} truncate max-w-xs`}>
                                            {conv.last_message.is_from_me && "Vous: "}
                                            {conv.last_message.message}
                                        </span>
                                        <span className="text-xs text-gray-400 ml-auto">
                                            {new Date(conv.last_message.created_at).toLocaleTimeString('fr-FR', { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </span>
                                    </div>
                                )}
                            </button>
                        </li>
                    ))}
                </h1>
            )}

            <ChatWidget/>

            {isInCall && (
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                        width:"60%",
                        height:"40%",
                        position:"absolute",
                        zIndex:"10",
                        background:"black"
                    }}
                />
            )}

            {selectedUser && (
                <div className="p-4 w-full absolute left-0 h-full overflow-x-hidden flex flex-col"
                     style={{
                         background: "linear-gradient(to bottom, #ec4899, #8b5cf6)"
                     }}>

                    <div className="fixed top-0 grid grid-cols-2 h-16 w-full md:w-90 left-0 z-4 items-center" 
                    style={{
                         background: "linear-gradient(to bottom, #ec4899, #8b5cf6)"
                     }}
                    >
                        <div className="flex gap-10">
                            <button 
                                className="btn btn-ghost btn-circle"
                                onClick={() => {
                                    setSelectedUser(null)
                                    setUserMessages([])
                                    onConversationStateChange(false)
                                }}
                            >
                                <FontAwesomeIcon icon={faAngleLeft} size={"2x"} color={"blue"} />
                            </button>

                            <h2 className="text-2xl font-bold text-white">
                                {selectedUser.user?.name}
                            </h2>
                        </div>

                        <div className="text-white flex gap-2 justify-end">
                            <button className="btn btn-ghost">
                                <FontAwesomeIcon icon={faPhone} size={"2x"} color={"blue"} />
                            </button>
                            <button className="btn btn-ghost" onClick={callingVideo}>
                                <FontAwesomeIcon icon={faVideoCamera} size={"2x"} color={"blue"} />
                            </button>
                            <button className="btn btn-ghost">
                                <FontAwesomeIcon icon={faInfoCircle} size={"2x"} color={"blue"}/>
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 text-xl text-white flex-1 w-full overflow-y-scroll pb-20">
                        
                        {userMessages.length === 0 && (
                            <span className="loading loading-spinner loading-xl"></span>
                        )}
                        {userMessages.map(msg => (
                            <div
                                key={msg.id}
                                className={`chat ${msg.isMine ? "chat-end" : "chat-start"}`}
                            >
                                <p className={`chat-bubble ${msg.isMine ? "chat-bubble-primary" : "chat-bubble-secondary"}`}>
                                    {msg.content || msg.message}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="fixed p-2 bottom-0 flex w-full md:w-90 h-15 left-0 z-6 items-center gap-1.5 flex-wrap">
                        <button className="btn btn-ghost btn-circle flex-1">
                            <FontAwesomeIcon icon={faImage} color={"blue"} size={"2x"} />
                        </button>
                        <button className="btn btn-ghost btn-circle flex-1">
                            <FontAwesomeIcon icon={faMicrophone} color={"blue"} size={"2x"} />
                        </button>

                        <form className="flex-1" onSubmit={(e)=>{e.preventDefault(); sendMessage()}}>
                            <textarea
                                className="rounded-xl w-44 resize-none bg-white h-auto"
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