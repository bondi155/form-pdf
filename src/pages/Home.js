import React, { useState, useEffect } from 'react';
import '../css/App.css';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config/config';
import { FaUserCircle } from 'react-icons/fa';
import PieChart from '../charts/PieChart';
import ListEval from '../components/ListEval';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';


function Home({ form }) {
  const domainParts = form.username.split('@')[1].split('.');
  const domainName = domainParts[0];


  return (
    <>
      <Container className='container-custom'>

          </Container>
    </>
  );
}

export default Home;
