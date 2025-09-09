import React, { useState } from 'react';
import ModernInput from '../Components/ModernInput';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

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
      className={`h-full bg-[#1c1c1c] text-white flex flex-col transition-all duration-300 ease-in-out relative ${
        isOpen ? 'w-96 p-6' : 'w-20 p-4'
      }`}
    >
      {/* Header row: button + title */}
      <div className="flex items-center gap-2 mb-8 mt-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-white focus:outline-none"
        >
          {isOpen ? <ChevronLeftIcon className="w-8 h-8" /> : <ChevronRightIcon className="w-8 h-8" />}
        </button>
        <span className="text-2xl font-semibold text-gray-200 select-none">Clases</span>
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
