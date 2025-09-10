import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import EditableNode from './Clase';
import RelacionUML from './Relacion';
import '../../styles/Diagramador.css';

// ...otros imports y hooks...

const nodeTypes = {
  clase: EditableNode,
};

const edgeTypes = {
  relacionConCardinalidad: RelacionUML,
};

export default function Diagramador({ nodesProp, edgesProp, onNodesChange, onEdgesChange, onConnect, ...props }) {
  const nodes = nodesProp || [];
  const edges = edgesProp || [];
  const RELACIONES = [
    { tipo: 'Asociación', style: { stroke: '#1976d2', strokeWidth: 2 }, markerEnd: undefined },
    { tipo: 'Agregación', style: { stroke: '#666', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: 'url(#diamond)' },
    { tipo: 'Composición', style: { stroke: '#000', strokeWidth: 2 }, markerEnd: 'url(#filledDiamond)' },
    { tipo: 'Herencia', style: { stroke: '#214422ff', strokeWidth: 2 }, markerEnd: 'url(#triangle)' },
  ];
  const [menuContextual, setMenuContextual] = useState(null);
  const [relacionSeleccionada, setRelacionSeleccionada] = useState(null);

  // Menú contextual para cambiar tipo de relación
  const onEdgeContextMenu = useCallback((event, edge) => {
    event.preventDefault();
    setMenuContextual({ x: event.clientX, y: event.clientY, edge });
    setRelacionSeleccionada(edge);
  }, []);

  const cambiarTipoRelacion = (relacion) => {
    if (relacionSeleccionada && onEdgesChange) {
      onEdgesChange([
        {
          type: 'replace',
          id: relacionSeleccionada.id,
          item: {
            ...relacionSeleccionada,
            style: relacion.style,
            markerEnd: relacion.markerEnd,
            label: relacion.tipo,
            type: 'relacionConCardinalidad',
            data: {
              ...relacionSeleccionada.data,
              label: relacion.tipo,
              markerEnd: relacion.markerEnd,
            },
          },
        },
      ]);
    }
    setMenuContextual(null);
  };

  const eliminarRelacion = () => {
    if (relacionSeleccionada && onEdgesChange) {
      onEdgesChange([{ id: relacionSeleccionada.id, type: 'remove' }]);
    }
    setMenuContextual(null);
  };

  // Inyectar los markers SVG en todos los SVGs de React Flow cada vez que se renderiza
  useEffect(() => {
    const injectMarkers = () => {
      const svgs = document.querySelectorAll('.react-flow__renderer > svg');
      svgs.forEach(svg => {
        // Eliminar defs previos para evitar duplicados
        const oldDefs = svg.querySelectorAll('defs');
        oldDefs.forEach(d => d.remove());
        // Crear nuevos defs
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
          <marker id="arrow" markerWidth="16" markerHeight="16" refX="16" refY="8" orient="auto" markerUnits="strokeWidth">
            <path d="M2,2 L16,8 L2,14" fill="none" stroke="#1976d2" stroke-width="2" />
          </marker>
          <marker id="triangle" markerWidth="16" markerHeight="16" refX="16" refY="8" orient="auto" markerUnits="strokeWidth">
            <path d="M2,2 L16,8 L2,14 Z" fill="white" stroke="#1976d2" stroke-width="2" />
          </marker>
          <marker id="diamond" markerWidth="16" markerHeight="16" refX="16" refY="8" orient="auto" markerUnits="strokeWidth">
            <polygon points="2,8 8,2 14,8 8,14 2,8" fill="white" stroke="#1976d2" stroke-width="2" />
          </marker>
          <marker id="filledDiamond" markerWidth="16" markerHeight="16" refX="16" refY="8" orient="auto" markerUnits="strokeWidth">
            <polygon points="2,8 8,2 14,8 8,14 2,8" fill="#1976d2" stroke="#1976d2" stroke-width="2" />
          </marker>
        `;
        svg.insertBefore(defs, svg.firstChild);
      });
    };
    // Inyectar al montar y cada vez que cambian los nodos/aristas
    injectMarkers();
    // Observar cambios en el DOM para reinyectar si React Flow vuelve a renderizar
    const observer = new MutationObserver(() => {
      injectMarkers();
    });
    document.querySelectorAll('.react-flow__renderer').forEach(el => {
      observer.observe(el, { childList: true, subtree: true });
    });
    return () => observer.disconnect();
  }, [nodes, edges]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        onEdgeContextMenu={onEdgeContextMenu}
      >
        <Background />
        <MiniMap />
        <Controls />
        {menuContextual && (
          <div style={{ position: 'fixed', top: menuContextual.y, left: menuContextual.x, background: '#fff', border: '1px solid #ccc', zIndex: 1000, padding: 8, borderRadius: 6 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Tipo de relación</div>
            {RELACIONES.map(relacion => (
              <button key={relacion.tipo} style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: 2 }} onClick={() => cambiarTipoRelacion(relacion)}>
                {relacion.tipo}
              </button>
            ))}
            <button style={{ color: 'red', marginTop: 6 }} onClick={eliminarRelacion}>Eliminar relación</button>
          </div>
        )}
      </ReactFlow>
    </div>
  );
}


