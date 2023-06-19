import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../components/img/logo.png';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import '../css/App.css';

function Login() {
    const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [login, setLogin] = useState(false);

  const handleInputChange = (event) => {
    console.log(event.target.value);
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleClick = () =>{   
  if ((form.username === "alice") && (form.password ==="demo")){
    setLogin(true);
    navigate('/home', { replace: true });
  }else{
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Usuario Incorrecto'
      })
  }
}
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
      <Button className='mt-5' size="sm" onClick={handleClick} variant='success'>
        Iniciar Sesión
      </Button>
    </Form>
  </div>
  );
}

export default Login;
