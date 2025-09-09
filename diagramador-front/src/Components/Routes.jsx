import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Pantalla from '../Pages/Pantalla';

function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/diagramador" element={<Pantalla />} />
				{/* Puedes agregar más rutas aquí */}
			</Routes>
		</BrowserRouter>
	);
}

export default AppRoutes;
