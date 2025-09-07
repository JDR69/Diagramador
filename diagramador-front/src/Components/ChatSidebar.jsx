import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import api from '../Api/Axios';

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
      // Llamada real al backend Spring Boot usando instancia centralizada
      const resp = await api.post('/uml-chat', { prompt: input });
      if (resp.data && resp.data.response) {
        botMsg = { sender: 'bot', text: resp.data.response };
        // Si el backend devuelve instrucciones estructuradas, procesarlas
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
    <div style={{ width: 340, height: '100vh', background: '#f8fafd', borderLeft: '1px solid #ddd', display: 'flex', flexDirection: 'column', position: 'fixed', right: 0, top: 0, zIndex: 200 }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 12, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <div style={{
              display: 'inline-block',
              background: msg.sender === 'user' ? '#1976d2' : '#fff',
              color: msg.sender === 'user' ? '#ffffffff' : '#222',
              borderRadius: 12,
              padding: '8px 14px',
              maxWidth: 220,
              fontSize: 15,
              boxShadow: '0 1px 4px #0001'
            }}>{msg.text}</div>
          </div>
        ))}
        {loading && <div style={{ color: '#1976d2', fontStyle: 'italic', margin: 8 }}>Pensando...</div>}
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid #1976d2', padding: 10, background: '#fff' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, padding: 8, borderRadius: 8, background: '#f4f6fa', color: '#000' }}
        />
        <button type="submit" style={{ background: 'none', border: 'none', color: '#1976d2', fontSize: 22, marginLeft: 8, cursor: 'pointer' }}>
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}
