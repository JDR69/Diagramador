import React from 'react';
import { getStraightPath } from 'reactflow';




function RelacionUML({ id, sourceX, sourceY, targetX, targetY, style = {}, data = {}, markerEnd }) {
  const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  // Determinar tipo de marker y asignar id único por edge
    const tipo = data.label;
  let markerType = markerEnd?.match(/filledDiamond|diamond|triangle|arrow/)?.[0];
  if (!markerType) {
    const tipos = {
      'Composición': 'filledDiamond',
      'Agregación': 'diamond',
      'Herencia': 'triangle',
      'Generalización': 'triangle',
      'Realización de Interfaz': 'triangle',
      'Dependencia': 'arrow',
      'Asociación Dirigida': 'arrow'
    }
    markerType = tipos[tipo] || null; 
    }
  // id único por edge
  const markerId = markerType ? `${markerType}-${id}` : undefined;
  const markerUrl = markerId ? `url(#${markerId})` : undefined;

  return (
    <g>
      {markerType && (
        <defs>
          {markerType === 'diamond' && (
            <marker id={markerId} markerWidth="16" markerHeight="16" refX="16" refY="8" orient="auto" markerUnits="strokeWidth">
              <polygon points="2,8 8,2 14,8 8,14 2,8" fill="white" stroke="#1976d2" strokeWidth="2" />
            </marker>
          )}
          {markerType === 'filledDiamond' && (
            <marker id={markerId} markerWidth="16" markerHeight="16" refX="16" refY="8" orient="auto" markerUnits="strokeWidth">
              <polygon points="2,8 8,2 14,8 8,14 2,8" fill="#1976d2" stroke="#1976d2" strokeWidth="2" />
            </marker>
          )}
          {markerType === 'triangle' && (
            <marker id={markerId} markerWidth="16" markerHeight="16" refX="16" refY="8" orient="auto" markerUnits="strokeWidth">
              <path d="M2,2 L16,8 L2,14 Z" fill="white" stroke="#1976d2" strokeWidth="2" />
            </marker>
          )}
          {markerType === 'arrow' && (
            <marker id={markerId} markerWidth="16" markerHeight="16" refX="16" refY="8" orient="auto" markerUnits="strokeWidth">
              <path d="M2,2 L16,8 L2,14" fill="none" stroke="#1976d2" strokeWidth="2" />
            </marker>
          )}
        </defs>
      )}
      <path
        d={path}
        stroke={style.stroke || '#1976d2'}
        strokeWidth={style.strokeWidth || 2}
        fill="none"
        {...(markerUrl ? { markerEnd: markerUrl } : {})}
        strokeDasharray={style.strokeDasharray || '0'}
        strokeLinecap="butt"
      />
      {/* Cardinalidades */}
      <text
        x={sourceX + (targetX - sourceX) * 0.12}
        y={sourceY + (targetY - sourceY) * 0.12 - 4}
        fontSize="13"
        fill="#1976d2"
        fontWeight="bold"
        textAnchor="middle"
        alignmentBaseline="middle"
        style={{ userSelect: 'none' }}
      >
        {data.cardinalidadOrigen ?? '1'}
      </text>
      <text
        x={targetX + (sourceX - targetX) * 0.12}
        y={targetY + (sourceY - targetY) * 0.12 - 4}
        fontSize="13"
        fill="#1976d2"
        fontWeight="bold"
        textAnchor="middle"
        alignmentBaseline="middle"
        style={{ userSelect: 'none' }}
      >
        {data.cardinalidadDestino ?? '*'}
      </text>
    </g>
  );
}

export default RelacionUML;
