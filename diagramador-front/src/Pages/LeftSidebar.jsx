
import React, { useState } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/20/solid';

function LeftSidebar({ onAgregarClase }) {
	const [nombreClase, setNombreClase] = useState('');

	const handleAgregar = () => {
		if (nombreClase.trim()) {
			if (onAgregarClase) onAgregarClase(nombreClase.trim());
			setNombreClase('');
		}
	};

	return (
		<Popover className="relative h-full">
			<PopoverButton className="inline-flex items-center gap-x-1 text-sm font-semibold text-gray-900 bg-white px-4 py-2 rounded-l-lg shadow-md border border-gray-200 hover:bg-gray-50 focus:outline-none">
				<span>Clases</span>
				<ChevronDownIcon aria-hidden="true" className="w-5 h-5" />
			</PopoverButton>
			<PopoverPanel className="absolute left-0 z-10 mt-2 flex w-72 max-w-xs bg-white rounded-3xl shadow-lg p-6 border border-gray-200">
				<div className="flex flex-col w-full">
					<h3 className="font-bold text-lg mb-4 text-gray-900">Agregar Clase</h3>
					<div className="flex gap-2 mb-2">
						<input
							type="text"
							value={nombreClase}
							onChange={e => setNombreClase(e.target.value)}
							placeholder="Nombre de la clase"
							className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							onKeyDown={e => { if (e.key === 'Enter') handleAgregar(); }}
						/>
						<button
							className="inline-flex items-center justify-center bg-indigo-600 text-white rounded-lg px-3 py-2 hover:bg-indigo-700 focus:outline-none"
							onClick={handleAgregar}
							title="Agregar Clase"
						>
							<PlusIcon className="w-5 h-5" />
						</button>
					</div>
				</div>
			</PopoverPanel>
		</Popover>
	);
}

export default LeftSidebar;
