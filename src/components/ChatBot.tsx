import { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Bot, User, Loader2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Hello! I'm your OP=ANXIETY assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-pro-preview";
      
      const systemInstruction = `
        You are a helpful, professional, and efficient customer support AI for "OP=ANXIETY-=PainRealif.co", a premium pharmaceutical delivery service.
        Your goal is to answer customer questions about products, ordering, tracking, and contact information.
        
        Key Information:
        - Website Name: OP=ANXIETY-=PainRealif.co
        - Categories: Anxiety, Pain Killers, Tobacco, Bud-Weed.
        - WhatsApp: +44 7871 081869 (Link: https://wa.me/447871081869)
        - Email: crezzyocco@gmail.com
        - Tracking: Customers can track orders at /track
        - Contact Page: /contact
        - About Page: /about
        
        Guidelines:
        - Be concise and helpful.
        - If a user asks about specific categories, provide links:
          - Anxiety: /category/Anxiety
          - Pain Killers: /category/Pain%20Killers
          - Tobacco: /category/Tobacco
          - Bud-Weed: /category/Bud-Weed
        - If a user asks about their order status, direct them to /track.
        - If they need human help, suggest WhatsApp or the /contact page.
        - Use Markdown for formatting.
        - Always maintain a professional and trustworthy tone.
        - Do not give medical advice. If asked for medical advice, state that you are an assistant and they should consult a professional, but you can help with product availability and ordering.
      `;

      const chat = ai.chats.create({
        model: model,
        config: {
          systemInstruction: systemInstruction,
        },
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const result = await chat.sendMessage({ message: userMessage });
      const responseText = result.text || "I'm sorry, I couldn't process that request.";
      
      setMessages(prev => [...prev, { role: "model", text: responseText }]);
    } catch (error) {
      console.error("ChatBot Error:", error);
      setMessages(prev => [...prev, { role: "model", text: "Sorry, I'm having trouble connecting right now. Please try again later or contact us via WhatsApp." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-[2rem] shadow-2xl border border-black/5 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-black text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Support Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    m.role === "user" 
                      ? "bg-black text-white rounded-tr-none" 
                      : "bg-white border border-black/5 text-gray-800 rounded-tl-none shadow-sm"
                  }`}>
                    {m.text.split('\n').map((line, idx) => (
                      <p key={idx} className={idx > 0 ? "mt-2" : ""}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-black/5 p-4 rounded-2xl rounded-tl-none shadow-sm">
                    <Loader2 size={18} className="animate-spin text-gray-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="px-6 py-3 bg-white border-t border-black/5 flex gap-2 overflow-x-auto no-scrollbar">
              <Link to="/track" className="flex-shrink-0 px-3 py-1.5 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all">
                Track Order
              </Link>
              <Link to="/category/Anxiety" className="flex-shrink-0 px-3 py-1.5 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all">
                Anxiety
              </Link>
              <Link to="/category/Bud-Weed" className="flex-shrink-0 px-3 py-1.5 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all">
                Bud-Weed
              </Link>
              <Link to="/contact" className="flex-shrink-0 px-3 py-1.5 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all">
                Contact
              </Link>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-black/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask a question..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-gray-900 transition-colors relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
        <div className="relative">
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </div>
      </motion.button>
    </div>
  );
}
