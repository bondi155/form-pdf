import React,{useEffect, useState} from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import NavigationBar from './components/NavigationBar';
import ReportCard from './pages/ReportCard';
import Home from './pages/Home';
import './css/App.css';
import PersonalData from './pages/PersonalData';
import Evaluations from './pages/Evaluatiions';
import SpinnerComponent from './components/Spinner';
function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulando un tiempo de carga
    setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
  }, []);

  if (!isLoaded) {
    return (
      <div className='d-flex justify-content-center align-items-center vh-100'> 
    <SpinnerComponent />
    </div>
    );
  }

  return (
    <BrowserRouter basename='/'>
      <Routes>
        <Route path='/' element={<Navigate replace to='/login' />} />
        <Route path='/login' element={<Login />} />
        <Route path='/*' element={<Navigate replace to='/login' />} />
        <Route element={<NavigationBar />}>
          <Route path='/home' element={<Home />} />
          <Route path='/reportCard' element={<ReportCard />} />
          <Route path='/personalData' element={<PersonalData />} />
          <Route path='/evaluationData' element={<Evaluations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
