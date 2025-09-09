
import React, { useState } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { ChevronDownIcon, PaperAirplaneIcon } from '@heroicons/react/20/solid';
import api from '../Api/Axios';
import '../styles/Diagramador.css';

const initialMessages = [
  { sender: 'bot', text: '¡Hola! Soy tu asistente UML. Pídeme diagramas de clase o hazme preguntas.' }
];

export default function ChatSidebar({ onPrompt, setNodos, setAristas }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    let botMsg = { sender: 'bot', text: 'Generando diagrama(s)...' };
    try {
      const resp = await api.post('/uml-chat', { prompt: input });
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
    <Popover className="relative h-full float-right">
      <PopoverButton className="inline-flex items-center gap-x-1 text-sm font-semibold text-gray-900 bg-white px-4 py-2 rounded-r-lg shadow-md border border-gray-200 hover:bg-gray-50 focus:outline-none">
        <span>Chat</span>
        <ChevronDownIcon aria-hidden="true" className="w-5 h-5" />
      </PopoverButton>
      <PopoverPanel className="absolute right-0 z-10 mt-2 flex w-80 max-w-xs bg-white rounded-3xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col w-full h-96">
          <div className="flex-1 overflow-y-auto mb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`mb-3 text-${msg.sender === 'user' ? 'right' : 'left'}`}> 
                <div className={`inline-block rounded-xl px-4 py-2 max-w-xs text-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-indigo-600 italic my-2">Pensando...</div>}
          </div>
          <form onSubmit={handleSend} className="flex border-t border-indigo-200 pt-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button type="submit" className="ml-2 bg-indigo-600 text-white rounded-lg px-3 py-2 hover:bg-indigo-700 focus:outline-none flex items-center justify-center">
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </PopoverPanel>
    </Popover>
  );
}
