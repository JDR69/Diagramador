import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import '../../styles/Diagramador.css';

function EditableNode({ data, selected }) {
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [nombre, setNombre] = useState(data.label || 'Clase');
  const [atributos, setAtributos] = useState(data.atributos || []);
  const [nuevoAtributo, setNuevoAtributo] = useState('');
  const inputNombreRef = useRef(null);
  const inputAtributoRef = useRef(null);

  const actualizarNodo = (nuevoNombre, nuevosAtributos) => {
    if (data.onLabelChange) {
      data.onLabelChange(data.id, nuevoNombre, nuevosAtributos);
    }
  };

  const agregarAtributo = () => {
    if (nuevoAtributo.trim()) {
      const nuevosAtributos = [...atributos, nuevoAtributo.trim()];
      setAtributos(nuevosAtributos);
      actualizarNodo(nombre, nuevosAtributos);
      setNuevoAtributo('');
    }
  };

  const eliminarAtributo = (indice) => {
    const nuevosAtributos = atributos.filter((_, i) => i !== indice);
    setAtributos(nuevosAtributos);
    actualizarNodo(nombre, nuevosAtributos);
  };

  const editarAtributo = (indice, nuevoValor) => {
    const nuevosAtributos = atributos.map((attr, i) => i === indice ? nuevoValor : attr);
    setAtributos(nuevosAtributos);
    actualizarNodo(nombre, nuevosAtributos);
  };

  useEffect(() => {
    setNombre(data.label || 'Clase');
    setAtributos(data.atributos || []);
  }, [data.label, data.atributos]);

  const esInterfaz = data.tipo === 'Interfaz';

  return (
    <div className={`editable-node ${esInterfaz ? 'editable-node-interfaz' : ''} ${selected ? 'editable-node-selected' : ''}`}>
      {/* Handles para conectar relaciones */}
      <Handle type="target" position={Position.Top} id="top" className="editable-node-handle" />
      <Handle type="target" position={Position.Left} id="left" className="editable-node-handle" />
      <Handle type="source" position={Position.Right} id="right" className="editable-node-handle" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="editable-node-handle" />
      <div className="editable-node-header">
        {editandoNombre ? (
          <input
            ref={inputNombreRef}
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            onBlur={() => {
              setEditandoNombre(false);
              actualizarNodo(nombre, atributos);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                setEditandoNombre(false);
                actualizarNodo(nombre, atributos);
              }
            }}
            className="editable-node-header-input"
            autoFocus
          />
        ) : (
          <span 
            className={`editable-node-header-span ${!nombre ? 'editable-node-header-placeholder' : ''}`}
            onClick={() => setEditandoNombre(true)}
          >
            {nombre || 'Nombre de la clase'}
          </span>
        )}
        {esInterfaz && <div className="editable-node-header-tipo">{'<<interface>>'}</div>}
      </div>
      <div className="editable-node-atributos">
        {atributos.map((atributo, indice) => (
          <AtributoEditable
            key={indice}
            valor={atributo}
            onCambio={(nuevoValor) => editarAtributo(indice, nuevoValor)}
            onEliminar={() => eliminarAtributo(indice)}
          />
        ))}
        <div className="editable-node-atributo-add-row">
          <input
            ref={inputAtributoRef}
            value={nuevoAtributo}
            onChange={e => setNuevoAtributo(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                agregarAtributo();
              }
            }}
            placeholder="Nuevo atributo..."
            className="editable-node-atributo-add-input"
          />
          <button
            onClick={agregarAtributo}
            className="editable-node-atributo-add-btn"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

function AtributoEditable({ valor, onCambio, onEliminar }) {
  const [editando, setEditando] = useState(false);
  const [valorTemp, setValorTemp] = useState(valor);
  const inputRef = useRef(null);

  useEffect(() => {
    setValorTemp(valor);
  }, [valor]);

  return (
    <div className="editable-node-atributo-row">
      {editando ? (
        <input
          ref={inputRef}
          value={valorTemp}
          onChange={e => setValorTemp(e.target.value)}
          onBlur={() => {
            setEditando(false);
            onCambio(valorTemp);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              setEditando(false);
              onCambio(valorTemp);
            }
          }}
          className="editable-node-atributo-input"
          autoFocus
        />
      ) : (
        <span
          className="editable-node-atributo-span"
          onClick={() => setEditando(true)}
        >
          {valor}
        </span>
      )}
      <button
        onClick={onEliminar}
        className="editable-node-atributo-delete"
      >
        ×
      </button>
    </div>
  );
}

export default EditableNode;
