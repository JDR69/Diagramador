import React, { useState, useRef, useEffect } from 'react';
import api from '../Api/Axios';
import ModernInput from '../Components/ModernInput';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

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
      className={`h-full bg-[#1c1c1c] text-white flex flex-col transition-all duration-300 ease-in-out relative ${
        isOpen ? 'w-96 p-6' : 'w-20 p-4'
      }`}
    >
      {/* Header row: button + title */}
      <div className="flex items-center gap-2 mb-4 mt-2">
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
          <div className="flex-1 overflow-y-auto mb-4 pr-1">
            {messages.map((msg, i) => (
              <div key={i} className={`flex mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-base shadow ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
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
        </>
      )}
    </div>
  );
}