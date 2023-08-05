import React, { useEffect, useState } from 'react';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/config.js';
import GridEval from '../charts/GridEval';
import Swal from 'sweetalert2';
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
      Swal.fire(
        'Good job!',
        'User Created!',
        'success'
      )    } catch (err) {
      if (err.response.data.code === 'USER_DUPLI') {
        Swal.fire('This user name already exists, please change the user name');
      }
    }
  };

  //llamada para traer info y mostrarla en tabla
  const getUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/getUserList`);
      setListUser(response.data);
      console.log(response.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Security Message',
          text: 'Token expire, please login again',
        });
      } else {
        Swal.fire('Ooops', 'Unable to get data', 'error');
        console.log('Error', err);
      }
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  //borrar usuario
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${API_URL}/deleteUser/${id}`);
        setListUser(listUser.filter((user) => user.id !== id));
        Swal.fire('Deleted!', 'The user has been deleted.', 'success');
      }
    });
    try {
    } catch (err) {
      console.error(err);
      Swal.fire('Ooops', 'Unable to delete user', 'error');
    }
  };

  return (
    <Container className='container-custom'>
      <h1>User Create Page </h1>
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
                <option value='company'>Company</option>
                <option value='controller'>Controller</option>
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
          <Col lg={4} sm={{ span: 4, offset: 5 }} md={6}>
            <Button className='mb-5' variant='outline-success' type='submit'>
              Create User
            </Button>
          </Col>
        </Row>
      </form>
      <h2 className='center-text'>User List</h2>
        <GridEval
          rows={listUser}
          columnsVar={userColumns}
          onDelete={handleDelete}
        />
    </Container>
  );
}

export default UserCreate;
