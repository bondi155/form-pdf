import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import NavigationBar from './components/NavigationBar';
import ReportCard from './pages/ReportCard';
import Home from './pages/Home';
import './css/App.css';
import PersonalData from './pages/PersonalData';
import Evaluations from './pages/Evaluations';
//import SpinnerComponent from './components/Spinner';
import UserCreate from './pages/UserCreate';
import PrivateRoute from './pages/PrivateRoute';
import axios from 'axios';
import Swal from 'sweetalert2';
import PlaneSpinner from './components/planeSpinner';
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
        <PlaneSpinner />
      </div>
    );
  }

  // quita al usuario luego de la expiracion del token
  axios.interceptors.response.use(
    function (response) {
      // Si la respuesta fue exitosa, simplemente la devolvemos
      return response;
    },
    function (error) {
      if (error.response && error.response.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Security Message',
          text: 'Token expire, please login again',
        });

          localStorage.removeItem('jwtToken');
          axios.defaults.headers.common['Authorization'] = '';
          window.location.href = '/';

      
      }
      // Si el error no fue un 403, simplemente lo devolvemos para que pueda ser manejado mas adelante
      return Promise.reject(error);
    }
  );
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
            path='/reportCard1010101'
            element={
              <PrivateRoute islogin={islogin}>
                <ReportCard />{' '}
              </PrivateRoute>
            }
          />
          <Route
            path='/consolidateInformation'
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
