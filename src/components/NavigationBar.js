import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import logoNav from '../components/img/logonav.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function NavigationBar({ setIslogin }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    axios.defaults.headers.common['Authorization'] = '';
    setIslogin(false);
    navigate('/');
  };

  return (
    <>
      <Navbar
        collapseOnSelect
        fixed='top'
        bg='dark'
        expand='md'
        variant='dark'
        className='mb-3'
      >
        <Link to='/home' className='nav-link'>
          {' '}
          <Navbar.Brand className='font-weight-bold text-muted'>
            <img
              src={logoNav}
              width='68'
              height='50'
              className='d-inline-block align-top'
              alt='React Bootstrap logo'
            />{' '}
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse className='justify-content-end'>
          <Nav>
            <Link to='/userCreation' className='nav-link'>
              Users
            </Link>
            <Link to='/personalData' className='nav-link'>
              Personal data{' '}
            </Link>
            <Link to='/evaluationData' className='nav-link'>
              Evaluation data{' '}
            </Link>
          {/*  <Link to='/formController' className='nav-link'>
              Form Controller{' '}
            </Link>
            <Link to='/reportCard' className='nav-link'>
              Report Card
            </Link> */}
            <Button variant='link' size='sm' onClick={handleLogout}>
              Logout
            </Button>
            &nbsp;
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Outlet />
    </>
  );
}

export default NavigationBar;
