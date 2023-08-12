import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../components/img/logo.png';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import '../css/App.css';
import { API_URL } from '../config/config';
import axios from 'axios';
import SpinnerComponent from '../components/Spinner.js';

function Login({ setIslogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', role: '', password: '' });
  const [isloading, SetIsloading] = useState(false);

  const handleInputChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleClick = async () => {
    try {
      SetIsloading(true);
      const response = await axios.post(`${API_URL}/loginUsers`, {
        username: form.username,
        password: form.password,
      }); //pass incorrecto
      if (response.data.code === 'USR_INCOR') {
        SetIsloading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Password incorrect',
        });
        //importante user no existe , si no pasaran como ok los que no existen
      } else if (response.data.code === 'USR_NOT_EXIST') {
        SetIsloading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'User does not exist',
        });
      } else {
        //si pasa bien
        localStorage.setItem('jwtToken', response.data.token);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
        navigate('/home', { replace: true });
        setIslogin(true);
        SetIsloading(false);
      }
    } catch (error) {
      SetIsloading(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error,
      });
    }
  };

  return (
    <div className='App'>
      {isloading ? (
        <SpinnerComponent />
      ) : (
        <Form className='login-form'>
          <img src={logo} className='App-logo' alt='logo' />

          <Form.Group controlId='formBasicUser'>
            <Form.Label>User</Form.Label>
            <Form.Control
              type='text'
              placeholder='User'
              onChange={handleInputChange}
              name='username'
            />
          </Form.Group>
          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              name='password'
              placeholder='Password'
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button
            className='mt-5'
            size='md'
            onClick={handleClick}
            variant='secondary'
          >
            Login{' '}
          </Button>
        </Form>
      )}
    </div>
  );
}

export default Login;
