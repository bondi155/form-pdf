import React, { useState } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import logoNav from '../components/img/logonav.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiLogOut } from 'react-icons/fi';

function NavigationBar({ setIslogin, form }) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    axios.defaults.headers.common['Authorization'] = '';
    setIslogin(false);
    navigate('/');
  };

  const [navOpen, setNavOpen] = useState(false);

  const handleLinkClick = () => {
    setNavOpen(false);
  };

  const handleToggleClick = () => {
    setNavOpen((prevOpen) => !prevOpen);
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
        expanded={navOpen}
      >
        <Link to='/home' className='nav-link'>
          <Navbar.Brand className='font-weight-bold text-muted'>
            
            <img
              src={logoNav}
              width='68'
              height='50'
              className='d-inline-block align-top'
              alt='React Bootstrap logo'
            />
          </Navbar.Brand>
        </Link>

        <Navbar.Toggle onClick={handleToggleClick} />

   <Navbar.Collapse className='justify-content-end'>
          <Nav>
            {form.role === 'admin' && (
              <>
                <Link
                  to='/userCreation'
                  className='nav-link'
                  onClick={handleLinkClick}
                >
                  Users
                </Link>
                <Link
                  to='/consolidateInformation'
                  className='nav-link'
                  onClick={handleLinkClick}
                >
                  Consolidate
                </Link>
                <Link
                  to='/evaluationData'
                  className='nav-link'
                  onClick={handleLinkClick}
                >
                  Evaluations
                </Link>
                <Link to='/GoogleDriveSeach' className='nav-link' onClick={handleLinkClick}>
                  Drive Directory
                </Link>
              </>
            )}
             {form.role === 'company' && (
            <Link
              to='/consultAirlineGrid'
              className='nav-link'
              onClick={handleLinkClick}
            >
              Consult Airline
            </Link>
            )}
            <Button
              variant='dark'
              className='logout-button'
              onClick={handleLogout}
              size='sm'
            >
              <FiLogOut className='me-1 mb-1' />
              Sign out
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
