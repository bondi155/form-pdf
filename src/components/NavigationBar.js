import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import logoNav from '../components/img/logonav.png';
import { LinkContainer } from 'react-router-bootstrap';

function NavigationBar() {
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
        <LinkContainer to='/home'>
          <Navbar.Brand className='font-weight-bold text-muted'>
            <img
              src={logoNav}
              width='68'
              height='50'
              className='d-inline-block align-top'
              alt='React Bootstrap logo'
            />{' '}
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse className='justify-content-end'>
          <Nav>
            <LinkContainer to='/home'>
              <Nav.Link>Home </Nav.Link>
            </LinkContainer>
            <LinkContainer to='/personalData'>
              <Nav.Link>Personal data </Nav.Link>
            </LinkContainer>
            <LinkContainer to='/formController'>
              <Nav.Link>Form Controller </Nav.Link>
            </LinkContainer>
            <LinkContainer to='/reportCard'>
              <Nav.Link>Report Card </Nav.Link>
            </LinkContainer>
            <LinkContainer to='/userCreate'>
              <Nav.Link>Users </Nav.Link>
            </LinkContainer>
            &nbsp;
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Outlet />
    </>
  );
}

export default NavigationBar;
