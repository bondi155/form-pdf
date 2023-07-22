import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../components/img/logo.png';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import '../css/App.css';
import { API_URL } from '../config/config';
import axios from 'axios';

function Login({ setIslogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', role: '', password: '' });

  const handleInputChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleClick = async () => {
    try {
      const response = await axios.post(`${API_URL}/loginUsers`, {
        username: form.username,
        password: form.password,
      }); //pass incorrecto
      if (response.data.code === 'USR_INCOR') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Password incorrect',
        });
        //importante user no existe , si no pasaran como ok los que no existen
      } else if (response.data.code === 'USR_NOT_EXIST') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'User does not exist',
        });
      } else {
        //si pasa bien
        localStorage.setItem('jwtToken', response.data.token);
        axios.defaults.headers.common['Authorization'] =
          'Bearer ' + response.data.token;
        setIslogin(true);
        navigate('/home', { replace: true });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error,
      });
    }
  };

  return (
    <div className='App'>
      <Form className='login-form'>
        <img src={logo} className='App-logo' alt='logo' />

        <Form.Group controlId='formBasicUser'>
          <Form.Label>Usuario</Form.Label>
          <Form.Control
            type='text'
            placeholder='Ingresa tu usuario'
            onChange={handleInputChange}
            name='username'
          />
        </Form.Group>
        <Form.Group controlId='formBasicPassword'>
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type='password'
            name='password'
            placeholder='Contraseña'
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button
          className='mt-5'
          size='sm'
          onClick={handleClick}
          variant='success'
        >
          Iniciar Sesión
        </Button>
      </Form>
    </div>
  );
}

export default Login;
