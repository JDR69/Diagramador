import React from 'react';
import { PlusIcon, MicrophoneIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

// A simple sound wave icon component
const SoundWaveIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="18" y1="8" x2="18" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="6" y1="8" x2="6" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function ModernInput({
  value,
  onChange,
  onKeyDown,
  placeholder,
  onIconClick,
  showPlus = true,
  chat = false,
  loading = false,
}) {
  return (
    <div className={`w-full flex items-center bg-[#2d2d2d] rounded-full p-2 shadow-lg ${chat ? 'gap-2' : ''}`}>
      {!chat && showPlus && (
        <button
          onClick={onIconClick}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Action"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      )}
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={`flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none px-3 text-lg ${chat ? 'py-3' : ''}`}
        disabled={loading}
      />
      {chat ? (
        <button
          onClick={onIconClick}
          className="p-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full text-white hover:scale-105 transition-transform shadow-lg focus:outline-none"
          aria-label="Enviar mensaje"
          disabled={loading}
        >
          <PaperAirplaneIcon className="w-6 h-6 rotate-45" />
        </button>
      ) : (
        <>
          <button className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Use microphone">
            <MicrophoneIcon className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
}
