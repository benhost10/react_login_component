import { faAngleLeft, faCamera, faImage, faInfoCircle, faMicrophone, faPaperPlane, faPhone, faThumbsUp, faVideoCamera } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef, useState } from "react"
import ChatWidget from "../chatwidget/chatwidget"

const AUTH_HEADERS = {
    "Authorization": "Bearer 1618|r9jwabVtVCtMYVfeyBIljAFOASZXIr5zNJ2ZwLiEf2bbc0c2",
    "Content-Type": "application/json"
}

function Message({ onConversationStateChange }){

    const [donnee,setDonnee]=useState([])
    const [erreur,setErreur]=useState(null)
    const [chargement,setChargement]=useState(true)    
    const [selectedUser, setSelectedUser] = useState(null)
    const [userEntry,setUserEntry]=useState("")
    const [userMessages,setUserMessages]=useState([])

    const [isInCall, setIsInCall]=useState(false)
    const videoRef=useRef(null)

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

    // ✅ CHARGEMENT DES CONVERSATIONS (AVEC TOKEN)
    useEffect(()=>{
        const fetchConversations = async()=>{
            try{
                const res = await fetch(
                  "https://api.react.nos-apps.com/api/groupe-4/chat/conversations",
                  { headers: AUTH_HEADERS }
                )
                if(!res.ok) throw new Error("erreur reseau")
                const data = await res.json()
                console.log("📋 Conversations reçues:", data)
                console.log("📋 Première conversation complète:", JSON.stringify(data[0], null, 2))
                setDonnee(data)
            }catch(err){
                setErreur(err.message)
            }finally{
                setChargement(false)
            }
        }
        fetchConversations()
    },[])

    // ✅ CHARGEMENT DES MESSAGES - VERSION CORRIGÉE
    const fetchMessages = async (conversationId) => {
        console.log("🔥 fetchMessages appelée avec ID:", conversationId)
        
        try {
            console.log("📡 Envoi de la requête...")
            
            const res = await fetch(
              `https://api.react.nos-apps.com/api/groupe-4/chat/messages/${conversationId}`,
              { headers: AUTH_HEADERS }
            )
            
            console.log("📥 Réponse reçue - Status:", res.status)
            console.log("📥 Headers:", res.headers)
            
            // ✅ AFFICHER LA RÉPONSE BRUTE MÊME SI ERREUR
            const textResponse = await res.text()
            console.log("📄 Réponse brute (texte):", textResponse)
            
            if (!res.ok) {
                console.error(`❌ Erreur HTTP ${res.status}`)
                throw new Error(`Erreur HTTP ${res.status}: ${textResponse}`)
            }
            
            // Parser le JSON
            const data = JSON.parse(textResponse)
            console.log("✅ Data parsée:", data)
            console.log("✅ Type de data:", typeof data, "- Est un tableau?", Array.isArray(data))
            
            // ✅ GESTION DE DIFFÉRENTES STRUCTURES DE RÉPONSE
            let messages = []
            
            if (Array.isArray(data)) {
                // Si c'est directement un tableau
                messages = data
            } else if (data.data && Array.isArray(data.data)) {
                // Si c'est un objet avec propriété 'data'
                messages = data.data
            } else if (data.messages && Array.isArray(data.messages)) {
                // Si c'est un objet avec propriété 'messages'
                messages = data.messages
            } else if (data.id && data.message) {
                // Si c'est UN SEUL message (comme dans votre exemple Postman)
                messages = [data]
            } else {
                console.warn("⚠️ Structure de données non reconnue:", data)
                messages = []
            }
            
            console.log("📨 Messages finaux à afficher:", messages)
            console.log("📊 Nombre de messages:", messages.length)
            
            setUserMessages(messages)
            
            // Marquer comme lu
            await fetch(
              `https://api.react.nos-apps.com/api/groupe-4/chat/messages/${conversationId}/read`,
              {
                method: "POST",
                headers: AUTH_HEADERS
              }
            )
        } catch (err) {
            
            alert("Erreur: " + err.message)
        }
    }

    if(erreur){
        return <p>erreur: {erreur}</p>
    }
    if(chargement){
        return <p>loading...</p>
    }

    const checkEntry=(e)=>{
        setUserEntry(e.target.value)
    }

    // ✅ MODIFICATION : Envoi RÉEL du message vers l'API
    const sendMessage = async () => {
        if (userEntry.trim() === "") return

        // ✅ MODIFICATION : Sauvegarder le message avant de vider le champ
        const messageToSend = userEntry.trim()

        // ✅ MODIFICATION : Créer le message temporaire pour affichage immédiat
        const tempMessage = {
            id: Date.now(),
            content: messageToSend,
            message: messageToSend,
            isMine: true
        }

        // ✅ MODIFICATION : Afficher le message immédiatement (UX optimiste)
        setUserMessages([...userMessages, tempMessage])
        setUserEntry("")

        
        try {
            
            
         
            const receiverId = selectedUser.user?.id
            
            console.log("📤 Receiver ID:", receiverId)
            console.log("📤 Message à envoyer:", messageToSend)
            
            if (!receiverId) {
                
                alert("Erreur: Impossible de trouver le destinataire")
                // ✅ MODIFICATION : Retirer le message temporaire
                setUserMessages(prevMessages => prevMessages.filter(msg => msg.id !== tempMessage.id))
                return
            }

        
            const requestBody = {
                receiver_id: receiverId,
                message: messageToSend
            }
            
            console.log("📤 Body de la requête:", JSON.stringify(requestBody, null, 2))

            const res = await fetch(
                "https://api.react.nos-apps.com/api/groupe-4/chat/send",
                {
                    method: "POST",
                    headers: AUTH_HEADERS,
                    body: JSON.stringify(requestBody)
                }
            )

            

            // ✅ MODIFICATION : Lire la réponse complète (même en cas d'erreur)
            const responseText = await res.text()
            console.log("📄 Réponse brute du serveur:", responseText)

            if (!res.ok) {
                console.error("❌ Erreur lors de l'envoi - Status:", res.status)
                console.error("❌ Réponse d'erreur:", responseText)
                throw new Error(`Erreur HTTP ${res.status}: ${responseText}`)
            }

            // ✅ MODIFICATION : Parser le JSON
            const data = JSON.parse(responseText)
            console.log("✅ Message envoyé avec succès:", data)

            // ✅ NOUVEAU : Rafraîchir les messages pour obtenir l'ID réel du serveur
            const conversationId = selectedUser.id || selectedUser.user?.id
            await fetchMessages(conversationId)

        } catch (err) {
            
            
            // ✅ MODIFICATION : Retirer le message temporaire en cas d'erreur
            setUserMessages(prevMessages => prevMessages.filter(msg => msg.id !== tempMessage.id))
        }
    }

    return(
        <div className=" bg-white h-full  w-full absolute z-2 mt-10">

            {!selectedUser && (
                <h1 className=" z-3 w-full">
                    {donnee.map((conv, index) => (
                        <li 
                            key={conv.id || conv.user?.id || index}
                            className="list-none"
                            onClick={() => {
                                
                                
                              
                                const conversationId = conv.id || conv.user?.id
                                
                                console.log("✅ ID final utilisé:", conversationId)
                                setSelectedUser(conv)
                                fetchMessages(conversationId)
                                onConversationStateChange(true)
                            }}
                        >
                            <button className=" btn btn-ghost w-full flex justify-start text-black">
                                {conv.user?.name || "Utilisateur"}
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
                <div className="p-4 w-full absolute left-0 h-full bg-white overflow-x-hidden flex flex-col">

                    <div className="fixed top-0 grid grid-cols-2 h-16 bg-gray-500 w-full left-0 z-4 items-center">
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
                            // <p className="text-center text-gray-500">Aucun message</p>
                        )}
                        {userMessages.map(msg => (
                            <div
                                key={msg.id}
                                className={`chat ${msg.isMine ? "chat-end" : "chat-start"}`}
                                // className={`chat-bubble ${msg.mine ? "chat-bubble-primary":"chat-bubble-secondary"} `}

                                
                            >
                                <p className="chat-bubble chat-bubble-primary">
                                    {msg.content || msg.message}
                                </p>
                                {/* <p className="chat-bubble chat-bubble-secondary">{msg.message} </p>
                                <p className="chat-bubble chat-bubble-primary">{msg.content} </p> */}
                            </div>
                        ))}
                    </div>

                    <div className="fixed p-2 bottom-0 flex w-full h-15 bg-gray-700 left-0 z-6 items-center gap-1.5 flex-wrap">
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