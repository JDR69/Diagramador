// =====================
// IMPORTS DE LIBRERÍAS
// =====================
import React, { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Handle,
  Position,
  getStraightPath,
  BaseEdge,
  EdgeLabelRenderer
} from 'reactflow';
import 'reactflow/dist/style.css';
import '../styles/Diagramador.css';

// =====================
// DECLARACIÓN DE CONST
// =====================
const RELACIONES = [
  { tipo: 'Composición', style: { stroke: '#000', strokeWidth: 2, strokeDasharray: '0' }, type: 'relacionConCardinalidad', markerEnd: 'url(#filledDiamond)' },
  { tipo: 'Agregación', style: { stroke: '#666', strokeWidth: 2, strokeDasharray: '5,5' }, type: 'relacionConCardinalidad', markerEnd: 'url(#diamond)' },
  { tipo: 'Asociación', style: { stroke: '#1976d2', strokeWidth: 2, strokeDasharray: '0' }, type: 'relacionConCardinalidad', markerEnd: 'url(#arrow)' },
  { tipo: 'Herencia', style: { stroke: '#4CAF50', strokeWidth: 2, strokeDasharray: '0' }, type: 'relacionConCardinalidad', markerEnd: 'url(#triangle)' },
];

// =====================
// FUNCIONES/COMPONENTES
// =====================

// Nodo editable básico para React Flow
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

  React.useEffect(() => {
    setNombre(data.label || 'Clase');
    setAtributos(data.atributos || []);
  }, [data.label, data.atributos]);

  const esInterfaz = data.tipo === 'Interfaz';

  return (
    <div className={`editable-node ${esInterfaz ? 'editable-node-interfaz' : ''} ${selected ? 'editable-node-selected' : ''}`}>
      {/* Handles para conectar relaciones */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ background: '#1976d2' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ background: '#1976d2' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ background: '#1976d2' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ background: '#1976d2' }}
      />
      
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

// Componente auxiliar para editar atributos
function AtributoEditable({ valor, onCambio, onEliminar }) {
  const [editando, setEditando] = useState(false);
  const [valorTemp, setValorTemp] = useState(valor);
  const inputRef = useRef(null);

  React.useEffect(() => {
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

// COMPONENTE PERSONALIZADO DE RELACIÓN CON CARDINALIDAD
function RelacionConCardinalidad({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, data = {}, markerEnd }) {
  // Estado para menú contextual de cardinalidad
  const [menuCard, setMenuCard] = useState({ visible: false, x: 0, y: 0, lado: null });

  // Opciones de cardinalidad
  const opcionesCard = ['0', '1', '*'];

  // Cerrar menú contextual al hacer click fuera
  React.useEffect(() => {
    if (!menuCard.visible) return;
    const cerrar = () => setMenuCard({ visible: false, x: 0, y: 0, lado: null });
    window.addEventListener('click', cerrar);
    return () => window.removeEventListener('click', cerrar);
  }, [menuCard.visible]);
  const [editandoOrigen, setEditandoOrigen] = useState(false);
  const [editandoDestino, setEditandoDestino] = useState(false);
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [valorOrigen, setValorOrigen] = useState(data.cardinalidadOrigen ?? '1');
  const [valorDestino, setValorDestino] = useState(data.cardinalidadDestino ?? '*');
  const [valorNombre, setValorNombre] = useState(data.label || '');
  const inputOrigenRef = useRef(null);
  const inputDestinoRef = useRef(null);
  const inputNombreRef = useRef(null);
  const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  React.useEffect(() => {
    if (!editandoOrigen && data.cardinalidadOrigen !== undefined && data.cardinalidadOrigen !== valorOrigen) {
      setValorOrigen(data.cardinalidadOrigen);
    }
  }, [data.cardinalidadOrigen]);
  
  React.useEffect(() => {
    if (!editandoDestino && data.cardinalidadDestino !== undefined && data.cardinalidadDestino !== valorDestino) {
      setValorDestino(data.cardinalidadDestino);
    }
  }, [data.cardinalidadDestino]);
  
  React.useEffect(() => {
    setValorNombre(data.label || '');
  }, [data.label]);

  const midX = sourceX + (targetX - sourceX) * 0.5;
  const midY = sourceY + (targetY - sourceY) * 0.5;

  const actualizarCardinalidad = (lado, valor) => {
    window.dispatchEvent(
      new CustomEvent('actualizarCardinalidad', {
        detail: { id, lado, valor }
      })
    );
  };

  const actualizarNombre = (valor) => {
    window.dispatchEvent(
      new CustomEvent('actualizarNombreRelacion', {
        detail: { id, valor }
      })
    );
  };

  // Mostrar el tipo de flecha (nombre de la relación) siempre, editable con doble click
  return (
    <>
      <BaseEdge 
        path={path} 
        markerEnd={markerEnd} 
        style={{
          stroke: style.stroke || '#1976d2',
          strokeWidth: style.strokeWidth || 2,
          strokeDasharray: style.strokeDasharray || '0',
          ...style
        }} 
      />
      <EdgeLabelRenderer>
        {/* Cardinalidad origen */}
        <div
          className="edge-cardinalidad edge-cardinalidad-origen"
          style={{ left: sourceX + (targetX - sourceX) * 0.12, top: sourceY + (targetY - sourceY) * 0.12, minWidth: 24, minHeight: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: editandoOrigen ? '2px solid #1976d2' : undefined, background: editandoOrigen ? '#e3f2fd' : undefined }}
          onClick={e => { e.stopPropagation(); setEditandoOrigen(true); }}
          onContextMenu={e => {
            e.preventDefault();
            setMenuCard({ visible: true, x: e.clientX, y: e.clientY, lado: 'origen' });
          }}
        >
          {editandoOrigen ? (
            <input
              ref={el => {
                inputOrigenRef.current = el;
                if (el) { el.focus(); el.select(); }
              }}
              value={valorOrigen}
              onChange={e => setValorOrigen(e.target.value)}
              onBlur={() => {
                setEditandoOrigen(false);
                actualizarCardinalidad('origen', valorOrigen);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  setEditandoOrigen(false);
                  actualizarCardinalidad('origen', valorOrigen);
                }
              }}
              className="edge-cardinalidad-input"
              style={{ width: 28, textAlign: 'center' }}
            />
          ) : (
            <span className="edge-cardinalidad-span" style={{ width: 24, textAlign: 'center', color: '#1976d2', fontWeight: 700 }}>{valorOrigen}</span>
          )}
        </div>
        {/* Cardinalidad destino */}
        <div
          className="edge-cardinalidad edge-cardinalidad-destino"
          style={{ left: targetX + (sourceX - targetX) * 0.12, top: targetY + (sourceY - targetY) * 0.12, minWidth: 24, minHeight: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: editandoDestino ? '2px solid #1976d2' : undefined, background: editandoDestino ? '#e3f2fd' : undefined }}
          onClick={e => { e.stopPropagation(); setEditandoDestino(true); }}
          onContextMenu={e => {
            e.preventDefault();
            setMenuCard({ visible: true, x: e.clientX, y: e.clientY, lado: 'destino' });
          }}
        >
          {editandoDestino ? (
            <input
              ref={el => {
                inputDestinoRef.current = el;
                if (el) { el.focus(); el.select(); }
              }}
              value={valorDestino}
              onChange={e => setValorDestino(e.target.value)}
              onBlur={() => {
                setEditandoDestino(false);
                actualizarCardinalidad('destino', valorDestino);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  setEditandoDestino(false);
                  actualizarCardinalidad('destino', valorDestino);
                }
              }}
              className="edge-cardinalidad-input"
              style={{ width: 28, textAlign: 'center' }}
            />
          ) : (
            <span className="edge-cardinalidad-span" style={{ width: 24, textAlign: 'center', color: '#1976d2', fontWeight: 700 }}>{valorDestino}</span>
          )}
        </div>
      {/* Menú contextual de cardinalidad */}
      {menuCard.visible && (
        <div
          style={{
            position: 'fixed',
            top: menuCard.y,
            left: menuCard.x,
            background: '#fff',
            border: '1px solid #1976d2',
            borderRadius: 4,
            boxShadow: '0 1px 4px #0002',
            zIndex: 2000,
            padding: 0,
            minWidth: 40,
            fontSize: 14,
            minHeight: 0
          }}
          onClick={e => e.stopPropagation()}
        >
          {opcionesCard.map(op => (
            <button
              key={op}
              onClick={() => {
                setMenuCard({ visible: false, x: 0, y: 0, lado: null });
                if (menuCard.lado === 'origen') actualizarCardinalidad('origen', op);
                if (menuCard.lado === 'destino') actualizarCardinalidad('destino', op);
              }}
              style={{
                width: '100%',
                padding: '4px 0',
                background: 'none',
                border: 'none',
                color: '#1976d2',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'background 0.2s',
                minHeight: 0
              }}
              onMouseOver={e => e.currentTarget.style.background='#e3f2fd'}
              onMouseOut={e => e.currentTarget.style.background='none'}
            >
              {op}
            </button>
          ))}
        </div>
      )}
        {/* Nombre de la relación (tipo de flecha) SIEMPRE visible y editable con doble click */}
        <div
          className="edge-label"
          style={{ left: midX, top: midY, background: '#fff', border: '2px solid #1976d2', color: style.stroke || '#1976d2', fontWeight: 700 }}
          onDoubleClick={e => { e.stopPropagation(); setEditandoNombre(true); }}
        >
          {editandoNombre ? (
            <input
              ref={inputNombreRef}
              value={valorNombre}
              onChange={e => setValorNombre(e.target.value)}
              onBlur={() => { setEditandoNombre(false); actualizarNombre(valorNombre); }}
              onKeyDown={e => { if (e.key === 'Enter') { setEditandoNombre(false); actualizarNombre(valorNombre); }}}
              className="edge-label-input"
              autoFocus
            />
          ) : (
            valorNombre || 'Relación'
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
// =====================
// CONSTANTES DE CONFIGURACIÓN
// =====================
const nodeTypes = {
  editableNode: EditableNode,
};

const tiposDeRelacion = {
  relacionConCardinalidad: RelacionConCardinalidad,
};

// =====================
// COMPONENTE PRINCIPAL
// =====================
function Diagramador({ nodesProp, edgesProp, onNodesChange, onEdgesChange, onConnect, onLabelChange }) {
  // Estado para controlar el menú contextual de las relaciones
  const [menuContextual, setMenuContextual] = useState(null);
  const [cardinalidadOrigen, setCardinalidadOrigen] = useState('');
  const [cardinalidadDestino, setCardinalidadDestino] = useState('');
  const diagramaRef = useRef();

  // Asegura que los arrays de nodos y relaciones sean válidos
  const nodos = Array.isArray(nodesProp) ? nodesProp : [];
  const relaciones = Array.isArray(edgesProp) ? edgesProp : [];

  // Convierte todos los nodos a tipo 'editableNode'
  const nodosPersonalizados = nodos.map(n => ({
    ...n,
    type: 'editableNode',
    data: { ...n.data, id: n.id, onLabelChange },
  }));

  // Convertir todas las relaciones a tipo personalizado para permitir edición directa
  const relacionesPersonalizadas = relaciones.map(rel => {
    // Buscar el tipo de relación para obtener el markerEnd correcto
    let markerEnd = rel.markerEnd;
    if (!markerEnd && rel.label) {
      const tipo = RELACIONES.find(r => r.tipo === rel.label);
      if (tipo && tipo.markerEnd) markerEnd = tipo.markerEnd;
    }
    return {
      ...rel,
      type: 'relacionConCardinalidad',
      markerEnd,
      data: {
        ...rel.data,
        cardinalidadOrigen: rel.data?.cardinalidadOrigen ?? '1',
        cardinalidadDestino: rel.data?.cardinalidadDestino ?? '*',
        label: rel.data?.label || rel.label || '',
      }
    };
  });

  // Manejar actualización de cardinalidad y nombre desde el componente de edge
  React.useEffect(() => {
    const handlerCard = (e) => {
      const { id, lado, valor } = e.detail;
      const nuevasRelaciones = relaciones.map(rel => {
        if (rel.id !== id) return rel;
        return {
          ...rel,
          data: {
            ...rel.data,
            cardinalidadOrigen: lado === 'origen' ? valor : rel.data?.cardinalidadOrigen ?? '1',
            cardinalidadDestino: lado === 'destino' ? valor : rel.data?.cardinalidadDestino ?? '*',
          }
        };
      });
      if (onEdgesChange) {
        onEdgesChange(nuevasRelaciones.map(rel => ({ id: rel.id, type: 'replace', item: rel })));
      }
    };
    
    const handlerNombre = (e) => {
      const { id, valor } = e.detail;
      const nuevasRelaciones = relaciones.map(rel => {
        if (rel.id !== id) return rel;
        return {
          ...rel,
          data: {
            ...rel.data,
            label: valor
          }
        };
      });
      if (onEdgesChange) {
        onEdgesChange(nuevasRelaciones.map(rel => ({ id: rel.id, type: 'replace', item: rel })));
      }
    };
    
    window.addEventListener('actualizarCardinalidad', handlerCard);
    window.addEventListener('actualizarNombreRelacion', handlerNombre);
    return () => {
      window.removeEventListener('actualizarCardinalidad', handlerCard);
      window.removeEventListener('actualizarNombreRelacion', handlerNombre);
    };
  }, [relaciones, onEdgesChange]);

  // Maneja el click derecho sobre una relación
  const alMenuContextualRelacion = useCallback((evento, relacion) => {
    evento.preventDefault();
    setMenuContextual({ idRelacion: relacion.id, x: evento.clientX, y: evento.clientY });
    setCardinalidadOrigen(relacion.data?.cardinalidadOrigen || '');
    setCardinalidadDestino(relacion.data?.cardinalidadDestino || '');
  }, []);

  // Elimina una relación del diagrama
  const eliminarRelacion = () => {
    if (menuContextual && menuContextual.idRelacion && onEdgesChange) {
      onEdgesChange([{ id: menuContextual.idRelacion, type: 'remove' }]);
    }
    setMenuContextual(null);
  };

  // Cambia el tipo de una relación existente
  const cambiarTipoRelacion = (relacion) => {
    if (menuContextual && menuContextual.idRelacion) {
      const relacionesActualizadas = relaciones.map(rel =>
        rel.id === menuContextual.idRelacion
          ? {
              ...rel,
              label: relacion.tipo,
              style: relacion.style,
              type: relacion.type || 'default',
              markerEnd: relacion.markerEnd,
              data: {
                ...rel.data,
                label: relacion.tipo,
                cardinalidadOrigen,
                cardinalidadDestino
              }
            }
          : rel
      );
      if (onEdgesChange) {
        onEdgesChange(relacionesActualizadas.map(rel => ({
          id: rel.id,
          type: 'replace',
          item: rel
        })));
      }
    }
    setMenuContextual(null);
  }

  // Maneja el movimiento de relaciones entre nodos
  const alActualizarRelacion = useCallback((relacionVieja, nuevaConexion) => {
    if (onEdgesChange) {
      const nuevaRelacion = {
        ...relacionVieja,
        source: nuevaConexion.source,
        target: nuevaConexion.target,
        sourceHandle: nuevaConexion.sourceHandle,
        targetHandle: nuevaConexion.targetHandle,
        id: `${nuevaConexion.source}-${nuevaConexion.target}-${Date.now()}`,
      };
      onEdgesChange([
        { id: relacionVieja.id, type: 'remove' },
        { type: 'add', item: nuevaRelacion }
      ]);
    }
  }, [onEdgesChange]);

  // Cierra el menú contextual cuando se hace click fuera de él
  React.useEffect(() => {
    if (!menuContextual) return;
    const cerrar = () => setMenuContextual(null);
    window.addEventListener('click', cerrar);
    return () => window.removeEventListener('click', cerrar);
  }, [menuContextual]);

  // =====================
  // CÓDIGO FRONT (JSX)
  // =====================
  return (
    <div className="diagramador-canvas" ref={diagramaRef} style={{ position: 'relative' }}>
      <ReactFlow
        nodes={nodosPersonalizados}
        edges={relacionesPersonalizadas}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={tiposDeRelacion}
        fitView
        nodesDraggable
        nodesConnectable
        edgesUpdatable
        onEdgeContextMenu={alMenuContextualRelacion}
        onEdgeUpdate={alActualizarRelacion}
      >
        <MiniMap />
        <Controls />
        <Background gap={16} />
      </ReactFlow>

      {/* Menú contextual para relaciones */}
      {menuContextual && (
        <div
          style={{
            position: 'fixed',
            top: menuContextual.y,
            left: menuContextual.x,
            background: '#fff',
            border: '1px solid #1976d2',
            borderRadius: 4,
            boxShadow: '0 1px 4px #0002',
            zIndex: 1000,
            padding: 0,
            minWidth: 120,
            fontSize: 12,
            minHeight: 0
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{padding:'2px 0 2px 0', borderBottom:'1px solid #eee', fontWeight:600, color:'#1976d2', textAlign:'center', fontSize:12}}>Relación</div>
          {RELACIONES.map(relacion => (
            <button
              key={relacion.tipo}
              onClick={() => cambiarTipoRelacion(relacion)}
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
          <button
            onClick={eliminarRelacion}
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

// =====================
// EXPORT DEFAULT
// =====================
export default Diagramador;
