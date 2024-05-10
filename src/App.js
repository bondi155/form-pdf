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
import ConsultAirline from './pages/ConsultAirline';
import EmailSender from './pages/EmailSender';
function App() {
  const [islogin, setIslogin] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [form, setForm] = useState({ username: '', role: '', password: '' });
  const [userCreate, setUserCreate] = useState({
    username: '',
    role: '',
    password: '',
  });
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
          element={<Login form={form} setForm={setForm} islogin={islogin} setIslogin={setIslogin} />}
        />
        <Route path='/*' element={<Navigate replace to='/login' />} />
        <Route
          element={<NavigationBar form={form} islogin={islogin} setIslogin={setIslogin} />}
        >
          <Route
            path='/home'
            element={
              <PrivateRoute islogin={islogin}>
                <Home  form={form} />
              </PrivateRoute>
            }
            
          />
          <Route
            path='/emailSender'
            element={
              <PrivateRoute islogin={islogin}>
                <EmailSender />
              </PrivateRoute>
            }
            
          />
          <Route
            path='/reportCard'
            element={
              <PrivateRoute islogin={islogin}>
                <ReportCard form={form} />{' '}
              </PrivateRoute>
            }
          />
          <Route
            path='/consolidateInformation'
            element={
              <PrivateRoute islogin={islogin}>
                <PersonalData form={form}/>{' '}
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
                <UserCreate  userCreate={userCreate} setUserCreate={setUserCreate}/>{' '}
              </PrivateRoute>
            }
          />
          <Route
            path='/consultAirlineGrid'
            element={
              <PrivateRoute islogin={islogin}>
                <ConsultAirline form={form} islogin={islogin} setIslogin={setIslogin}/>{' '}
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
