import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
//import AdminPage from './pages/AdminPage';
//import ClientPage from './pages/ClientPage';

function App() {
  console.log("Rendering App component");
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<HomePage />} />
                {/* <Route path="/admin" element={<AdminPage />} />
                <Route path="/client" element={<ClientPage />} /> */}
            </Routes>
            <div>
                <h1>Hello, World!</h1>
            </div>
        </Router>
    );
}

export default App;
