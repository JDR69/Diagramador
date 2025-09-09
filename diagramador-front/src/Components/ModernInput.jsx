import React from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

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
    <div className="w-full flex items-center bg-[#2d2d2d] rounded-full shadow-lg p-2">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none px-4 py-3 text-lg font-medium rounded-full border border-transparent focus:border-indigo-500 transition-all duration-200"
        disabled={loading}
      />
      {(showPlus || chat) && (
        <Button
          onClick={onIconClick}
          variant="contained"
          endIcon={<SendIcon />}
          disabled={loading}
          sx={{
            borderRadius: '100px',
            marginLeft: '10px',
            minWidth: '48px',
            minHeight: '48px',
            background: 'linear-gradient( #63acf1 0%, #355eb6 60%, #092ab9 100%)',
            color: '#fff',
            boxShadow: '0 4px 16px #a21caf33',
            '&:hover': { background: 'linear-gradient( #63acf1 0%, #355eb6 60%, #092ab9 100%)' }
          }}
          aria-label={chat ? "Enviar mensaje" : "Agregar"}
          type="button"
        >
        </Button>
      )}
    </div>
  );
}
