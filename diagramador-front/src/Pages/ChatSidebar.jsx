import React, { useState, useRef, useEffect } from 'react';
import api from '../Api/Axios';
import ModernInput from '../Components/ModernInput';
// ...existing code...
import '../styles/ChatSidebar.css';

const initialMessages = [
  { sender: 'bot', text: '¡Hola! Soy tu asistente UML. Pídeme diagramas de clase o hazme preguntas.' }
];

export default function ChatSidebar({ setNodos, setAristas }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);
    let botMsg = { sender: 'bot', text: 'Generando diagrama(s)...' };
    try {
      const resp = await api.post('/uml-chat', { prompt: currentInput });
      if (resp.data && resp.data.response) {
        botMsg = { sender: 'bot', text: resp.data.response };
        if (resp.data.diagram) {
          if (setNodos && setAristas) {
            setNodos(resp.data.diagram.nodes || []);
            setAristas(resp.data.diagram.edges || []);
          }
        }
      }
    } catch (err) {
      botMsg = { sender: 'bot', text: 'Error al contactar el backend.' };
    }
    setMessages(msgs => [...msgs, botMsg]);
    setLoading(false);
  };

  return (
    <div
      className={`chat-sidebar ${isOpen ? 'open' : 'closed'} h-full bg-[#1c1c1c] text-white flex flex-col transition-all duration-300 ease-in-out relative`}
    >
      {/* Header row: button + title */}
      <div className="flex flex-col items-center mb-8 mt-2">
        <button
          className="cursor-pointer relative bg-white/10 py-2 rounded-full min-w-[3.5rem] min-h-[2.92rem] group max-w-full flex items-center justify-start hover:bg-green-400 transition-all duration-[0.8s] ease-[cubic-bezier(0.510,0.026,0.368,1.016)] shadow-[inset_1px_2px_5px_#00000080]"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          aria-label="Toggle sidebar"
        >
          <div className="absolute flex px-1 py-0.5 justify-start items-center inset-0">
            <div className="w-[0%] group-hover:w-full transition-all duration-[1s] ease-[cubic-bezier(0.510,0.026,0.368,1.016)]" />
            <div className={`rounded-full shrink-0 flex justify-center items-center shadow-[inset_1px_-1px_3px_0_black] h-full aspect-square ${isOpen ? 'bg-green-400' : 'bg-black'} transition-all duration-[1s] ease-[cubic-bezier(0.510,0.026,0.368,1.016)] group-hover:bg-black`}>
              <div className={`size-[0.8rem] ${isOpen ? 'text-black' : 'text-white'} group-hover:text-white group-hover:-rotate-45 transition-all duration-[1s] ease-[cubic-bezier(0.510,0.026,0.368,1.016)]`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" height="100%" width="100%" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                  <path fill="currentColor" d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" />
                </svg>
              </div>
            </div>
          </div>
        </button>
        <span className="text-2xl font-semibold text-gray-200 select-none pt-3 px-2">Chat</span>
      </div>
      {isOpen && (
        <>
          {/* Mensajes tipo chat */}
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-bubble ${msg.sender === 'user' ? 'user' : 'bot'}`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="px-6 pb-6">
            <ModernInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Pregunta lo que quieras"
              onIconClick={handleSend}
              showPlus={false}
              chat={true}
              loading={loading}
            />
          </div>
        </>
      )}
    </div>
  );
}