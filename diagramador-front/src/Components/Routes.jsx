import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DiagramadorPage from '../Pages/Diagramador';

function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/diagramador" element={<DiagramadorPage />} />
				{/* Puedes agregar más rutas aquí */}
			</Routes>
		</BrowserRouter>
	);
}

export default AppRoutes;
