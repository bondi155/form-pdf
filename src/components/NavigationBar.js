import React, { useState } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import logoNav from '../components/img/logonav.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiLogOut } from 'react-icons/fi';
import '../css/App.css';
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
        className='mb-3 navbar-custom'
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
                  to='/reportCard'
                  className='nav-link'
                  onClick={handleLinkClick}
                >
                  Report Card
                </Link>
                <Link
                  to='/emailSender'
                  className='nav-link'
                  onClick={handleLinkClick}
                >
                  Email Sender
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
                  Drive Browser
                </Link>
              </>
            )}
             {form.role === 'company' && (
              <>   
            <Link
              to='/consultAirlineGrid'
              className='nav-link'
              onClick={handleLinkClick}
            >
              Consult Airline
            </Link>
              <Link
              to='/consolidateInformation'
              className='nav-link'
              onClick={handleLinkClick}
            >
              Course exams
            </Link>
            </>
            )}
            <Button
              variant='dark'
              className='logout-button'
              onClick={handleLogout}
              size='sm'
            >
              <FiLogOut className='me-1 mb-1' />
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
