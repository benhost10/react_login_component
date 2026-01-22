
import {  faBrain,  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      console.log("📤 Envoi au backend:", currentInput); // Debug

      const res = await fetch("http://192.168.100.21:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "123",
          message: currentInput
        })
      });

      console.log("📡 Statut de la réponse:", res.status); // Debug

      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }

      const data = await res.json();
      console.log("📥 Données reçues:", data); // Debug

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.reply || "Pas de réponse" }
      ]);
    } catch (error) {
      console.error("❌ Erreur:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "❌ Erreur de connexion" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Logo */}
      <div
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 w-14 h-14 bg-black text-white 
        rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform"
      >
        <FontAwesomeIcon icon={faBrain}  />
      </div>

      {/* Chat */}
      {open && (
        <div className="fixed bottom-24 right-5 w-96 h-10/12   shadow-xl rounded-lg flex flex-col">
          <div className="p-3 bg-black text-white text-center font-semibold  ">
            red team ia
          </div>

          <div className="flex-1 p-3 overflow-y-auto bg-gray-800">
            {messages.length === 0 && (
              <p className="text-gray-400 text-center ">
                Posez-moi une question...
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-3 ${
                  m.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg max-w-xs ${
                    m.role === "user"
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {m.content}
                </span>
              </div>
            ))}
            {loading && (
              <div className="text-left mb-3">
                <span className="inline-block p-2  rounded-lg">
                 
<div class="flex flex-row gap-2">
  <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
  <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
  <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
</div>
                </span>
              </div>
            )}
          </div>

          <div className="p-3 border-t flex gap-2">
            <textarea
            // cols={"4"}
              className="flex-1 border resize-none border-gray-300 p-2 rounded focus:outline-none focus:border-black max-w-3xl"
              value={input}
              onChange={e => setInput(e.target.value) }
              onKeyDown={e => e.key === "Enter" && !loading && sendMessage()}
              placeholder="Écris un message..."
              disabled={loading}
             
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-4 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "⏳" : "➤"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}