import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IssuancePage from './pages/IssuancePage';
import VerificationPage from './pages/VerificationPage';
import './App.css';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IssuancePage />} />
        <Route path="/verify" element={<VerificationPage />} />
      </Routes>
    </Router>
  );
};



export default App;
