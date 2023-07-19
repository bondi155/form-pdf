import React, { useEffect, useState } from 'react';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/config.js';
import GridEval from '../charts/GridEval';

const userColumns = [
  { field: 'id', headerName: 'ID', width: 150 },

  {
    field: 'user',
    headerName: 'User Name',
    width: 290,
    editable: true,
  },
  {
    field: 'role',
    headerName: 'Role',
    width: 290,
    editable: true,
  },
];

function UserCreate() {
  const [userCreate, setUserCreate] = useState({
    username: '',
    role: '',
    password: '',
  });

  const [listUser, setListUser] = useState([]);

  const navigate = useNavigate();

  const handleUserInput = (e) => {
    setUserCreate({
      ...userCreate,
      [e.target.name]: e.target.value,
    });
  };

  //Creación del usuario con rol y usuario
  const addNewUser = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/createUser`, {
        username: userCreate.username,
        role: userCreate.role,
        password: userCreate.password,
      });
      alert('Usuario creado ');
    } catch (err) {
      if (err.response.data.code === 'USER_DUPLI') {
        alert('This user name already exists, please change the user name');
      }
    }
  };

  //llamada para traer info y mostrarla en tabla
  const getUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/getUserList`);
      setListUser(response.data);
    } catch (err) {
      console.log('Error', err);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const userlistrows = listUser.map((row) => ({
    id: row.id,
    user: row.username,
    role: row.role,
  }));

  //borrar usuario
  const handleDelete = async (id) => {
    if (window.confirm('seguro quiere borrar este usuario?')) {
      // Intenta eliminar al usuario de la base de datos
      await axios.delete(`${API_URL}/deleteUser/${id}`);

      // Si se tiene éxito, actualiza el estado para eliminar al usuario de la vista
      setListUser(listUser.filter((user) => user.id !== id));

      // Aquí puedes mostrar un mensaje de éxito si lo deseas
      alert('Usuario eliminado correctamente');
    }
    try {
    } catch (err) {
      // Aquí puedes manejar cualquier error que pueda ocurrir
      console.error(err);
      alert('Hubo un error al eliminar al usuario');
    }
  };

  return (
    <Container className='container-custom'>
      <h2>User Create Page </h2>
      <hr></hr>
      <form onSubmit={addNewUser}>
        <Row>
          <Col lg={4} sm={4}>
            <Form.Group className='mb-3'>
              <Form.Control
                type='text'
                name='username'
                required
                placeholder='User Name'
                onChange={handleUserInput}
              />
            </Form.Group>
          </Col>

          <Col lg={4} sm={4}>
            <Form.Group className='mb-3'>
              <Form.Select
                aria-label='role'
                value={userCreate.role}
                name='role'
                required
                onChange={handleUserInput}
              >
                <option disabled value=''>
                  {' '}
                  User Type{' '}
                </option>
                <option value='capturista'>Capturista</option>
                <option value='aprobador'>Aprobador</option>
                <option value='admin'>Administrator</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col lg={4} sm={4}>
            <Form.Group className='mb-3'>
              <Form.Control
                type='password'
                required
                name='password'
                placeholder='Password'
                onChange={handleUserInput}
              />
            </Form.Group>
          </Col>
          <Col lg={2} sm={{ span: 3, offset: 5 }}>
            <Button className='mb-5' variant='outline-success' type='submit'>
              Create User
            </Button>
          </Col>
        </Row>
      </form>
      <h2 className='center-text'>User List</h2>
      <div className='tablaUsuario'>
        <GridEval
          rows={userlistrows}
          columnsVar={userColumns}
          onDelete={handleDelete}
        />
      </div>
    </Container>
  );
}

export default UserCreate;
