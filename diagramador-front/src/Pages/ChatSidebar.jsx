import React, { useState, useRef, useEffect } from 'react';
import api from '../Api/Axios';
import ModernInput from '../Components/ModernInput';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
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
      className={`chat-sidebar h-full bg-[#1c1c1c] text-white flex flex-col transition-all duration-300 ease-in-out relative ${
        isOpen ? 'w-96 p-0' : 'w-20 p-0'
      }`}
    >
      {/* Header row: button + title */}
      <div className="flex items-center gap-2 mb-2 mt-2 px-6 pt-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-white focus:outline-none"
        >
          {isOpen ? <ChevronRightIcon className="w-8 h-8" /> : <ChevronLeftIcon className="w-8 h-8" />}
        </button>
        <span className="text-2xl font-semibold text-gray-200 select-none">Chat</span>
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