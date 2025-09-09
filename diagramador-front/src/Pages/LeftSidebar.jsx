import React, { useState } from 'react';
import ModernInput from '../Components/ModernInput';
import '../styles/ChatSidebar.css';
const ButtonOpen = ({ isOpen, onClick }) => (
  <button
    className="cursor-pointer relative bg-white/10 py-2 rounded-full min-w-[3.5rem] min-h-[2.92rem] group max-w-full flex items-center justify-start hover:bg-green-400 transition-all duration-[0.8s] ease-[cubic-bezier(0.510,0.026,0.368,1.016)] shadow-[inset_1px_2px_5px_#00000080]"
    onClick={onClick}
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
);

export default function LeftSidebar({ onAgregarClase }) {
  const [nombreClase, setNombreClase] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const handleAgregar = () => {
    if (nombreClase.trim()) {
      if (onAgregarClase) onAgregarClase(nombreClase.trim());
      setNombreClase('');
    }
  };

  return (
     <div
      className={`chat-sidebar ${isOpen ? 'open' : 'closed'} h-full bg-[#1c1c1c] text-white flex flex-col transition-all duration-300 ease-in-out relative`}
    >
      {/* Header row: button + title */}
      <div className="flex flex-col items-center mb-8 mt-2">
        <ButtonOpen isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        <span className="text-2xl font-semibold text-gray-200 select-none pt-3 px-2">Clases</span>
      </div>
      {isOpen && (
        <>
          <div className="flex-1 flex flex-col justify-end mb-6">
            {/* ...existing code... */}
          </div>
          <ModernInput
            value={nombreClase}
            onChange={(e) => setNombreClase(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAgregar();
            }}
            placeholder="Nombre de la clase"
            onIconClick={handleAgregar}
            showPlus={true}
          />
        </>
      )}
    </div>
  );
}
