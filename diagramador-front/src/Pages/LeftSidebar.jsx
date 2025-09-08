import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/Diagramador.css';

export default function LeftSidebar({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`sidebar left${open ? '' : ' collapsed'}`}>
      <button className="sidebar-toggle" onClick={() => setOpen(o => !o)}>
        {open ? <FaChevronLeft /> : <FaChevronRight />}
      </button>
      {open && (
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {children || <div>Herramientas o menú aquí</div>}
        </div>
      )}
    </div>
  );
}
