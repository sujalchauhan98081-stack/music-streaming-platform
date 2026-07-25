import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";
import ChatBubble from "../components/ai/ChatBubble";
import { chatWithAiApi } from "../api/aiApi";

const AiChat = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey! I'm Sonique AI 🎵 Ask me for song recommendations, artist info, or playlist ideas." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // Send prior history (excluding the greeting) so the AI has conversational context
      const history = messages.slice(1).map((m) => ({ role: m.role, content: m.content }));
      const { data } = await chatWithAiApi(input, history);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      toast.error("AI chat failed — please try again");
      setMessages((prev) => prev.slice(0, -1)); // roll back the user message on failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-6 flex flex-col h-[calc(100vh-160px)]">
      <h2 className="text-3xl font-bold mb-6">Sonique AI Chat</h2>

      <div className="flex-1 overflow-y-auto bg-surface/30 rounded-lg p-4 mb-4">
        {messages.map((msg, index) => (
          <ChatBubble key={index} role={msg.role} content={msg.content} />
        ))}
        {loading && (
          <div className="flex justify-start mb-3">
            <div className="bg-surface px-4 py-3 rounded-2xl rounded-bl-sm text-sm text-textSecondary">
              Thinking...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about music, artists, or get playlist ideas..."
          className="flex-1 bg-surface px-5 py-3 rounded-full outline-none focus:ring-2 focus:ring-primary"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-primary text-black p-3 rounded-full disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default AiChat;