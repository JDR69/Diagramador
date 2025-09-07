import React from 'react';

import Diagramador from '../Components/Diagramador.jsx';
import { useState, useCallback } from 'react';
import { addEdge } from 'reactflow';


const RELACIONES = [
	{ tipo: 'Asociación', descripcion: 'Relación simple entre clases', style: { stroke: '#1976d2', strokeWidth: 2 }, markerEnd: 'url(#arrow)' },
	{ tipo: 'Asociación Dirigida', descripcion: 'Relación dirigida entre clases', style: { stroke: '#1976d2', strokeWidth: 2 }, markerEnd: 'url(#arrow)', type: 'step' },
	{ tipo: 'Agregación', descripcion: 'Una clase contiene a otra (pero pueden existir separadas)', style: { stroke: '#666', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: 'url(#diamond)', type: 'smoothstep' },
	{ tipo: 'Composición', descripcion: 'Una clase contiene a otra (dependencia fuerte)', style: { stroke: '#000', strokeWidth: 2 }, markerEnd: 'url(#filledDiamond)', type: 'smoothstep' },
	{ tipo: 'Dependencia', descripcion: 'Una clase depende de otra', style: { stroke: '#999', strokeWidth: 2, strokeDasharray: '2,2' }, markerEnd: 'url(#arrow)', type: 'dashed' },
	{ tipo: 'Generalización', descripcion: 'Herencia entre clases', style: { stroke: '#4CAF50', strokeWidth: 2 }, markerEnd: 'url(#triangle)', type: 'step' },
	{ tipo: 'Realización de Interfaz', descripcion: 'Una clase implementa una interfaz', style: { stroke: '#4CAF50', strokeWidth: 2, strokeDasharray: '2,2' }, markerEnd: 'url(#triangle)', type: 'step' },
];

const TIPOS_NODO = [
	{ tipo: 'Clase', icon: '📦', color: '#1976d2' },
	{ tipo: 'Interfaz', icon: '🔗', color: '#b59f00' },
];


function DiagramadorPage() {
		const [claseNombre, setClaseNombre] = useState('');
		const [tipoNodo, setTipoNodo] = useState(TIPOS_NODO[0].tipo);
		const [nodos, setNodos] = useState([]);
		const [aristas, setAristas] = useState([]);
		const [tipoRelacion, setTipoRelacion] = useState(RELACIONES[0].tipo);

	// Handlers compatibles con React Flow
	const handleNodesChange = useCallback((changes) => {
		setNodos((nds) => {
			let arr = Array.isArray(nds) ? nds : [];
			return changes.reduce((acc, change) => {
				if (change.type === 'position' && change.position) {
					return acc.map(n => n.id === change.id ? { ...n, position: change.position } : n);
				}
				if (change.type === 'remove') {
					return acc.filter(n => n.id !== change.id);
				}
				return acc;
			}, arr);
		});
	}, []);

	const handleEdgesChange = useCallback((changes) => {
		setAristas((eds) => {
			let arr = Array.isArray(eds) ? eds : [];
			return changes.reduce((acc, change) => {
				if (change.type === 'remove') {
					return acc.filter(e => e.id !== change.id);
				}
				if (change.type === 'replace') {
					return acc.map(e => e.id === change.id ? change.item : e);
				}
				if (change.type === 'add') {
					return [...acc, change.item];
				}
				return acc;
			}, arr);
		});
	}, []);

	// Agregar edge al conectar nodos, usando el tipo de relación seleccionado
	const handleConnect = useCallback((params) => {
		const relacion = RELACIONES.find(r => r.tipo === tipoRelacion) || RELACIONES[0];
		setAristas((eds) => [
			...(Array.isArray(eds) ? eds : []),
			{
				...params,
				id: `${params.source}-${params.target}-${Date.now()}`,
				label: relacion.tipo,
				animated: false,
				style: relacion.style,
				markerEnd: relacion.markerEnd || 'url(#arrow)',
				type: relacion.type || 'default',
			},
		]);
	}, [tipoRelacion]);

	return (
		<div style={{ display: 'flex', minHeight: '100vh', background: '#ffffffff' }}>
			{/* Sidebar */}
			<div style={{ width: 260, background: '#fff', borderRight: '1px solid #ddd', padding: 20 }}>
						<h2 style={{ marginBottom: 8 }}>Clases (Básico)</h2>
						<form
							onSubmit={e => {
								e.preventDefault();
								if (claseNombre.trim()) {
												setNodos(prev => {
													const arr = Array.isArray(prev) ? prev : [];
													return [
														...arr,
														{
															id: Date.now().toString(),
															type: 'editableNode',
															data: { label: claseNombre, tipo: tipoNodo },
															position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
														},
													];
												});
									setClaseNombre('');
								}
							}}
						>
							<div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
								<select value={tipoNodo} onChange={e => setTipoNodo(e.target.value)} style={{ flex: 1, padding: 6 }}>
									{TIPOS_NODO.map(n => (
										<option key={n.tipo} value={n.tipo}>{n.icon} {n.tipo}</option>
									))}
								</select>
							</div>
							<input
								type="text"
								placeholder="Nombre de la clase"
								value={claseNombre}
								onChange={e => setClaseNombre(e.target.value)}
								style={{ width: '100%', marginBottom: 8, padding: 6, background: '#222', color: '#fff', border: 'none', borderRadius: 3 }}
							/>
							<button type="submit" style={{ width: '100%', padding: 8, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold', fontSize: 16 }}>
								Agregar Clase
							</button>
						</form>
						<hr style={{ margin: '24px 0' }} />
						<label style={{ fontWeight: 'bold', marginBottom: 4, display: 'block' }}>Tipo de Relación</label>
						<select value={tipoRelacion} onChange={e => setTipoRelacion(e.target.value)} style={{ width: '100%', marginBottom: 16, padding: 6, background: '#222', color: '#fff', border: 'none', borderRadius: 3 }}>
							{RELACIONES.map(r => (
								<option key={r.tipo} value={r.tipo}>{r.tipo}</option>
							))}
						</select>
						
			</div>
			{/* Diagrama */}
					<div style={{ flex: 1, padding: 24, background: '#f4f6fa', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
						<h1 style={{ textAlign: 'center', marginBottom: 24, color: '#e0e0e0', fontWeight: 900, fontSize: 40, letterSpacing: 1, textShadow: '1px 2px 8px #2222' }}>Diagramador de Clases UML</h1>
						{/* Definición de marcadores SVG para flechas y diamantes */}
						<svg width="0" height="0">
							<defs>
								<marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="strokeWidth">
									<path d="M0,0 L10,5 L0,10 Z" fill="#1976d2" />
								</marker>
								<marker id="triangle" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="strokeWidth">
									<path d="M0,0 L10,5 L0,10 Z" fill="#fff" stroke="#1976d2" strokeWidth="2" />
								</marker>
								<marker id="diamond" markerWidth="16" markerHeight="16" refX="16" refY="8" orient="auto" markerUnits="strokeWidth">
									<polygon points="0,8 8,0 16,8 8,16" fill="#fff" stroke="#1976d2" strokeWidth="2" />
								</marker>
								<marker id="filledDiamond" markerWidth="16" markerHeight="16" refX="16" refY="8" orient="auto" markerUnits="strokeWidth">
									<polygon points="0,8 8,0 16,8 8,16" fill="#1976d2" />
								</marker>
							</defs>
						</svg>
								<Diagramador
									nodesProp={nodos}
									edgesProp={aristas}
									onNodesChange={handleNodesChange}
									onEdgesChange={handleEdgesChange}
									onConnect={handleConnect}
									onLabelChange={(id, nuevo, atributos) => {
										setNodos(nds => nds.map(n => n.id === id ? { 
											...n, 
											data: { 
												...n.data, 
												label: nuevo,
												atributos: atributos || n.data.atributos || []
											} 
										} : n));
									}}
								/>
					</div>
		</div>
	);
}

export default DiagramadorPage;
