import Diagramador from '../Components/Lienzo/Diagramador.jsx';
import { useState, useCallback } from 'react';
import { addEdge } from 'reactflow';
import ChatSidebar from './ChatSidebar.jsx';
import LeftSidebar from './LeftSidebar.jsx';


const RELACIONES = [
	{ tipo: 'Asociación', descripcion: 'Relación simple entre clases', style: { stroke: '#1976d2', strokeWidth: 2 }, markerEnd: undefined },
	{ tipo: 'Asociación Dirigida', descripcion: 'Relación dirigida entre clases', style: { stroke: '#1976d2', strokeWidth: 2 }, markerEnd: 'url(#arrow)', type: 'step' },
	{ tipo: 'Agregación', descripcion: 'Una clase contiene a otra (pero pueden existir separadas)', style: { stroke: '#666', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: 'url(#diamond)', type: 'smoothstep' },
	{ tipo: 'Composición', descripcion: 'Una clase contiene a otra (dependencia fuerte)', style: { stroke: '#000', strokeWidth: 2 }, markerEnd: 'url(#filledDiamond)', type: 'smoothstep' },
	{ tipo: 'Dependencia', descripcion: 'Una clase depende de otra', style: { stroke: '#999', strokeWidth: 2, strokeDasharray: '2,2' }, markerEnd: 'url(#arrow)', type: 'dashed' },
	{ tipo: 'Generalización', descripcion: 'Herencia entre clases', style: { stroke: '#325533ff', strokeWidth: 2 }, markerEnd: 'url(#triangle)', type: 'step' },
	{ tipo: 'Realización de Interfaz', descripcion: 'Una clase implementa una interfaz', style: { stroke: '#325533ff', strokeWidth: 2, strokeDasharray: '2,2' }, markerEnd: 'url(#triangle)', type: 'step' },
];



function Pantalla() {
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
		// markerEnd debe ser undefined si no hay, nunca string vacío
		const markerEnd = relacion.markerEnd === undefined ? undefined : relacion.markerEnd;
		setAristas((eds) => [
			...(Array.isArray(eds) ? eds : []),
			{
				...params,
				id: `${params.source}-${params.target}-${Date.now()}`,
				label: relacion.tipo === 'Asociación' ? '' : relacion.tipo,
				animated: false,
				style: relacion.style,
				markerEnd,
				type: 'relacionConCardinalidad',
				data: {
					label: relacion.tipo,
					markerEnd,
				},
			},
		]);
	}, [tipoRelacion]);

	// Nueva función para que el chat pueda modificar el diagrama
	const handlePrompt = async (prompt, setNodos, setAristas) => {
		if (prompt.toLowerCase().includes('dos diagramas de clase')) {
			// Generar dos nodos y una relación
			const id1 = Date.now().toString();
			const id2 = (Date.now() + 1).toString();
			setNodos(nds => [
				...nds,
				{ id: id1, type: 'clase', data: { label: 'ClaseA', tipo: 'Clase' }, position: { x: 200, y: 200 } },
				{ id: id2, type: 'clase', data: { label: 'ClaseB', tipo: 'Clase' }, position: { x: 500, y: 300 } },
			]);
					setAristas(eds => [
						...eds,
						{
							id: `${id1}-${id2}-${Date.now()}`,
							source: id1,
							target: id2,
							label: 'Asociación',
							type: 'relacionConCardinalidad',
							style: RELACIONES[0].style,
							markerEnd: undefined,
							data: { cardinalidadOrigen: '1', cardinalidadDestino: '*' }
						}
					]);
			return '¡Listo! Se agregaron dos clases y una relación de asociación.';
		}
		return 'No entendí tu petición, pero puedo ayudarte con diagramas de clase.';
	};

	return (
		<div className="w-screen h-screen min-h-0 min-w-0 flex overflow-hidden bg-white">
			{/* Left Sidebar */}
			<LeftSidebar
				onAgregarClase={nombreClase => {
					// Generar un id único y posición automática
					const id = Date.now().toString();
					setNodos(nds => [
						...nds,
						{
							id,
							type: 'clase',
							data: { label: nombreClase, tipo: 'Clase' },
							position: { x: 120 + Math.random() * 200, y: 120 + Math.random() * 200 }
						}
					]);
				}}
			/>
			{/* Diagrama */}
			<div className="flex-1 h-full min-h-0 min-w-0 flex flex-col p-0 bg-[#f4f6fa] rounded-none shadow-none">
				<h1 className="text-2xl text-center mb-1 text-gray-200  select-none">Diagramador de Clases UML</h1>
				<div className="flex-1 min-h-0 min-w-0">
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
			{/* Chat Sidebar a la derecha */}
			<ChatSidebar onPrompt={handlePrompt} setNodos={setNodos} setAristas={setAristas} />
		</div>
	);
}

export default Pantalla;
