import React, { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import '../styles/Diagramador.css';

// ========================================
// CONFIGURACIÓN DE TIPOS DE RELACIONES UML
// ========================================

/**
 * Definición de los tipos de relaciones UML disponibles
 * Cada relación triene su propio estilo visual y tipo de línea
 */
const RELACIONES = [
  { tipo: 'Asociación', style: { markerEnd: 'url(#arrow)' }, type: 'default' },
  { tipo: 'Asociación Dirigida', style: { markerEnd: 'url(#arrow)' }, type: 'step' },
  { tipo: 'Agregación', style: { strokeDasharray: '5,5', markerEnd: 'url(#diamond)' }, type: 'smoothstep' },
  { tipo: 'Composición', style: { stroke: '#000', strokeWidth: 2, markerEnd: 'url(#filledDiamond)' }, type: 'smoothstep' },
  { tipo: 'Dependencia', style: { strokeDasharray: '2,2', markerEnd: 'url(#arrow)' }, type: 'dashed' },
  { tipo: 'Generalización', style: { markerEnd: 'url(#triangle)' }, type: 'step' },
  { tipo: 'Realización de Interfaz', style: { markerEnd: 'url(#triangle)', strokeDasharray: '2,2' }, type: 'step' },
];

// ========================================
// COMPONENTE NODO EDITABLE
// ========================================

/**
 * Componente EditableNode - Representa una clase UML con capacidad de edición
 * Permite editar el nombre de la clase y agregar/editar/eliminar atributos
 * 
 * @param {string} id - Identificador único del nodo
 * @param {object} data - Datos del nodo (label, tipo, atributos, onLabelChange)
 * @param {boolean} selected - Si el nodo está seleccionado
 * @param {boolean} isConnectable - Si se pueden conectar relaciones a este nodo
 */
function EditableNode({ id, data, selected, isConnectable }) {
  // Estados para la edición del nombre de la clase
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(data.label);
  
  // Estados para la gestión de atributos
  const [atributos, setAtributos] = useState(data.atributos || []);
  const [editandoAtributo, setEditandoAtributo] = useState(-1);
  const [nuevoAtributo, setNuevoAtributo] = useState('');

  /**
   * Sincroniza los valores locales con los datos externos cuando cambian
   */
  React.useEffect(() => {
    setValor(data.label);
    setAtributos(data.atributos || []);
  }, [data.label, data.atributos]);

  /**
   * Maneja el final de la edición del nombre de la clase
   * Guarda el nuevo nombre si es válido y diferente al anterior
   */
  const handleBlur = () => {
    setEditando(false);
    if (valor.trim() && valor !== data.label && data.onLabelChange) {
      data.onLabelChange(id, valor);
    }
  };

  /**
   * Agrega un nuevo atributo a la clase
   * Valida que el atributo no esté vacío antes de agregarlo
   */
  const agregarAtributo = () => {
    if (nuevoAtributo.trim()) {
      const nuevosAtributos = [...atributos, nuevoAtributo.trim()];
      setAtributos(nuevosAtributos);
      setNuevoAtributo('');
      if (data.onLabelChange) {
        data.onLabelChange(id, valor, nuevosAtributos);
      }
    }
  };

  /**
   * Edita un atributo existente por su índice
   * @param {number} index - Índice del atributo a editar
   * @param {string} nuevoValor - Nuevo valor del atributo
   */
  const editarAtributo = (index, nuevoValor) => {
    const nuevosAtributos = [...atributos];
    nuevosAtributos[index] = nuevoValor;
    setAtributos(nuevosAtributos);
    if (data.onLabelChange) {
      data.onLabelChange(id, valor, nuevosAtributos);
    }
  };

  /**
   * Elimina un atributo por su índice
   * @param {number} index - Índice del atributo a eliminar
   */
  const eliminarAtributo = (index) => {
    const nuevosAtributos = atributos.filter((_, i) => i !== index);
    setAtributos(nuevosAtributos);
    if (data.onLabelChange) {
      data.onLabelChange(id, valor, nuevosAtributos);
    }
  };

  return (
    <div style={{
      background: data.tipo === 'Interfaz' ? '#fffbe6' : '#fff',
      border: data.tipo === 'Interfaz' ? '2px dashed #b59f00' : '2px solid #1976d2',
      borderRadius: 8,
      minWidth: 140,
      minHeight: 60,
      padding: 8,
      boxShadow: selected ? '0 0 0 2px #1976d2' : '0 1px 4px #0001',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      fontWeight: 600,
      fontSize: 14,
      cursor: 'pointer',
      position: 'relative',
    }}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      
      {/* Nombre de la clase */}
      <div style={{ textAlign: 'center', borderBottom: '1px solid #ddd', paddingBottom: 4, marginBottom: 4 }}>
        {editando ? (
          <input
            value={valor}
            autoFocus
            onChange={e => setValor(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={e => { if (e.key === 'Enter') handleBlur(); }}
            style={{ fontSize: 14, fontWeight: 600, border: 'none', outline: 'none', background: 'transparent', textAlign: 'center', color: '#111', width: '100%' }}
          />
        ) : (
          <span onDoubleClick={() => setEditando(true)} title="Doble click para editar" style={{ color: '#111', display: 'block' }}>
            {data.label || <span style={{ color: '#bbb' }}>Sin nombre</span>}
          </span>
        )}
        <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>{data.tipo}</div>
      </div>

      {/* Lista de atributos */}
      <div style={{ fontSize: 12, color: '#333' }}>
        {atributos.map((atributo, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 2, justifyContent: 'space-between' }}>
            {editandoAtributo === index ? (
              <input
                value={atributo}
                autoFocus
                onChange={e => editarAtributo(index, e.target.value)}
                onBlur={() => setEditandoAtributo(-1)}
                onKeyDown={e => { if (e.key === 'Enter') setEditandoAtributo(-1); }}
                style={{ fontSize: 12, border: 'none', outline: 'none', background: 'transparent', color: '#333', flex: 1 }}
              />
            ) : (
              <span 
                onDoubleClick={() => setEditandoAtributo(index)} 
                style={{ flex: 1, cursor: 'pointer' }}
                title="Doble click para editar"
              >
                • {atributo}
              </span>
            )}
            <button
              onClick={() => eliminarAtributo(index)}
              style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: 10, padding: 0, marginLeft: 4 }}
            >
              ✕
            </button>
          </div>
        ))}
        
        {/* Input para agregar nuevo atributo */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
          <input
            value={nuevoAtributo}
            onChange={e => setNuevoAtributo(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') agregarAtributo(); }}
            placeholder="+ atributo"
            style={{ fontSize: 11, border: 'none', outline: 'none', background: 'transparent', color: '#888', flex: 1, fontStyle: 'italic' }}
          />
          <button
            onClick={agregarAtributo}
            style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', fontSize: 12, padding: 0 }}
          >
            +
          </button>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}

// ========================================
// CONFIGURACIÓN DE TIPOS DE NODOS
// ========================================

/**
 * Configuración de tipos de nodos para React Flow
 * Define qué componente usar para cada tipo de nodo
 */
const nodeTypes = {
  editableNode: EditableNode,
};

// ========================================
// COMPONENTE PRINCIPAL DEL DIAGRAMADOR
// ========================================

/**
 * Componente Diagramador - Interfaz principal para crear diagramas UML
 * Maneja la visualización, edición y manipulación de nodos y relaciones
 * 
 * @param {Array} nodesProp - Lista de nodos del diagrama
 * @param {Array} edgesProp - Lista de relaciones del diagrama  
 * @param {Function} onNodesChange - Callback para cambios en nodos
 * @param {Function} onEdgesChange - Callback para cambios en relaciones
 * @param {Function} onConnect - Callback para nuevas conexiones
 * @param {Function} onLabelChange - Callback para cambios en etiquetas
 */
function Diagramador({ nodesProp, edgesProp, onNodesChange, onEdgesChange, onConnect, onLabelChange }) {
  // ========================================
  // PREPARACIÓN DE DATOS
  // ========================================
  
  /**
   * Asegura que los arrays de nodos y relaciones sean válidos
   * Previene errores si se pasan valores undefined o null
   */
  const nodes = Array.isArray(nodesProp) ? nodesProp : [];
  const edges = Array.isArray(edgesProp) ? edgesProp : [];

  /**
   * Convierte todos los nodos a tipo 'editableNode' y les pasa la función onLabelChange
   * Esto permite que todos los nodos sean editables con funcionalidad consistente
   */
  const customNodes = nodes.map(n => ({
    ...n,
    type: 'editableNode',
    data: { ...n.data, onLabelChange },
  }));

  // ========================================
  // GESTIÓN DEL MENÚ CONTEXTUAL
  // ========================================
  
  // Estado para controlar el menú contextual de las relaciones
  const [contextMenu, setContextMenu] = useState(null); // {edgeId, x, y}
  const diagramRef = useRef();

  /**
   * Maneja el click derecho sobre una relación (edge)
   * Muestra el menú contextual en la posición del cursor
   * @param {Event} event - Evento del click derecho
   * @param {Object} edge - Objeto de la relación clickeada
   */
  const onEdgeContextMenu = useCallback((event, edge) => {
    event.preventDefault();
    setContextMenu({ edgeId: edge.id, x: event.clientX, y: event.clientY });
  }, []);

  /**
   * Elimina una relación del diagrama
   * Se ejecuta cuando el usuario selecciona "Eliminar" en el menú contextual
   */
  const handleDeleteEdge = () => {
    if (contextMenu && contextMenu.edgeId && onEdgesChange) {
      onEdgesChange([{ id: contextMenu.edgeId, type: 'remove' }]);
    }
    setContextMenu(null);
  };

  /**
   * Cambia el tipo de una relación existente
   * Actualiza el estilo visual y la etiqueta de la relación
   * @param {Object} relacion - Objeto con la nueva configuración de relación
   */
  const handleChangeTipoRelacion = (relacion) => {
    if (contextMenu && contextMenu.edgeId) {
      // Actualizar el edge directamente en el state del componente padre
      const updatedEdges = edges.map(edge => 
        edge.id === contextMenu.edgeId 
          ? {
              ...edge,
              label: relacion.tipo,
              style: relacion.style,
              type: relacion.type || 'default',
            }
          : edge
      );
      
      // Llamar al parent component para actualizar el state
      if (onEdgesChange) {
        onEdgesChange(updatedEdges.map(edge => ({
          id: edge.id,
          type: 'replace',
          item: edge
        })));
      }
    }
    setContextMenu(null);
  };

  // ========================================
  // GESTIÓN DEL MOVIMIENTO DE RELACIONES
  // ========================================
  
  /**
   * Maneja el movimiento de relaciones entre nodos
   * Permite arrastrar el extremo de una relación de un nodo a otro
   * @param {Object} oldEdge - La relación original antes del movimiento
   * @param {Object} newConnection - Las nuevas conexiones de la relación
   */
  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    console.log('Edge update:', oldEdge, newConnection); // Debug
    if (onEdgesChange) {
      // Crear el nuevo edge con las nuevas conexiones, manteniendo todas las propiedades del edge original
      const newEdge = {
        ...oldEdge,
        source: newConnection.source,
        target: newConnection.target,
        sourceHandle: newConnection.sourceHandle,
        targetHandle: newConnection.targetHandle,
        id: `${newConnection.source}-${newConnection.target}-${Date.now()}`,
      };
      
      // Actualizar la lista de edges: eliminar el viejo y agregar el nuevo
      onEdgesChange([
        { id: oldEdge.id, type: 'remove' },
        { type: 'add', item: newEdge }
      ]);
    }
  }, [onEdgesChange]);

  // ========================================
  // GESTIÓN DE EVENTOS GLOBALES
  // ========================================
  
  /**
   * Cierra el menú contextual cuando se hace click fuera de él
   * Se ejecuta como efecto para limpiar event listeners
   */
  React.useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [contextMenu]);

  // ========================================
  // RENDERIZADO DEL COMPONENTE
  // ========================================
  
  return (
    <div className="diagramador-canvas" ref={diagramRef} style={{ position: 'relative' }}>
      {/* Componente principal de React Flow para el diagrama */}
      <ReactFlow
        nodes={customNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable
        nodesConnectable
        edgesUpdatable
        onEdgeContextMenu={onEdgeContextMenu}
        onEdgeUpdate={onEdgeUpdate}
      >
        {/* Mini mapa para navegación */}
        <MiniMap />
        {/* Controles de zoom y fit */}
        <Controls />
        {/* Fondo con patrón de puntos */}
        <Background gap={16} />
      </ReactFlow>
      
      {/* Menú contextual para relaciones */}
      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            background: '#fff',
            border: '1px solid #1976d2',
            borderRadius: 4,
            boxShadow: '0 1px 4px #0002',
            zIndex: 1000,
            padding: 0,
            minWidth: 90,
            fontSize: 12,
            minHeight: 0
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Encabezado del menú */}
          <div style={{padding:'2px 0 2px 0', borderBottom:'1px solid #eee', fontWeight:600, color:'#1976d2', textAlign:'center', fontSize:12}}>Relación</div>
          
          {/* Lista de tipos de relación disponibles */}
          {RELACIONES.map(relacion => (
            <button
              key={relacion.tipo}
              onClick={() => handleChangeTipoRelacion(relacion)}
              style={{
                width:'100%',
                padding:'2px 0 2px 8px',
                background:'none',
                border:'none',
                borderBottom:'1px solid #eee',
                color:'#222',
                fontSize:12,
                cursor:'pointer',
                textAlign:'left',
                transition:'background 0.2s',
                minHeight:0
              }}
              onMouseOver={e => e.currentTarget.style.background='#f0f4fa'}
              onMouseOut={e => e.currentTarget.style.background='none'}
            >
              {relacion.tipo}
            </button>
          ))}
          
          {/* Botón para eliminar la relación */}
          <button
            onClick={handleDeleteEdge}
            style={{
              width:'100%',
              padding:'2px 0',
              background:'none',
              border:'none',
              color:'#d32f2f',
              fontWeight:600,
              fontSize:12,
              cursor:'pointer',
              borderRadius:'0 0 4px 4px',
              transition:'background 0.2s',
              minHeight:0
            }}
            onMouseOver={e => e.currentTarget.style.background='#fbe9e7'}
            onMouseOut={e => e.currentTarget.style.background='none'}
          >
            🗑️ Eliminar
          </button>
        </div>
      )}
    </div>
  );
}

export default Diagramador;
