import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import NavigationBar from './components/NavigationBar';
import ReportCard from './pages/ReportCard';
import Home from './pages/Home';
import './css/App.css';
import PersonalData from './pages/PersonalData';
import Evaluations from './pages/Evaluatiions';
import SpinnerComponent from './components/Spinner';
import UserCreate from './pages/UserCreate';
import PrivateRoute from './pages/PrivateRoute';
function App() {
  const [islogin, setIslogin] = useState(false);
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
        <Route
          path='/login'
          element={<Login islogin={islogin} setIslogin={setIslogin} />}
        />
        <Route path='/*' element={<Navigate replace to='/login' />} />
        <Route
          element={<NavigationBar islogin={islogin} setIslogin={setIslogin} />}
        >
          <Route
            path='/home'
            element={
              <PrivateRoute islogin={islogin}>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path='/reportCard'
            element={
              <PrivateRoute islogin={islogin}>
                <ReportCard />{' '}
              </PrivateRoute>
            }
          />
          <Route
            path='/personalData'
            element={
              <PrivateRoute islogin={islogin}>
                <PersonalData />{' '}
              </PrivateRoute>
            }
          />
          <Route
            path='/evaluationData'
            element={
              <PrivateRoute islogin={islogin}>
                <Evaluations />{' '}
              </PrivateRoute>
            }
          />
          <Route
            path='/userCreation'
            element={
              <PrivateRoute islogin={islogin}>
                <UserCreate />{' '}
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
