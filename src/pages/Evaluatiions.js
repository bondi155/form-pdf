import React, { useState } from 'react';
import '../css/App.css';
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  FormControl,
  InputGroup,
  ListGroup,
  Tab,
} from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config/config';
function Evaluations() {
  const [evaluationForm, setEvaluationForm] = useState({
    no: '',
    solicitante: '',
    mes: '',
    area_soli: '',
    tipo_prueba: '',
    no_embajador: '',
    nombre_embajador: '',
    posicion: '',
    base: '',
    correo: '',
    horas_vuelo: '',
    rtari: '',
    fecha_primera_prueba: '',
    hora: '',
    calificacion: '',
    resultado: '',
  });

  const handleFormChange = (e) => {
    setEvaluationForm({
      ...evaluationForm,
      [e.target.name]: e.target.value,
    });
  };

  const getEvaluationData = () => {
    try {
      const response = axios.post(`${API_URL}/postEvaluationData`, {
        params: {},
      });
      setEvaluationForm(response.data);

    } catch (error) {}
  };

  return (
    <Container className='container-custom'>
      <h1>Evaluations</h1>
    <Row className='mt-4'>
    <Col> 
    </Col> 
    <Col> 
    </Col> 
    <Col> 
    </Col> 
    <Col> 
    </Col> 

    </Row>
    <Row className='mt-1'>
    <Col> 
    </Col> 
    <Col> 
    </Col> 
    <Col> 
    </Col> 
    <Col> 
    </Col> 

    </Row>
    <Row className='mt-1'>
    <Col> 
    </Col> 
    <Col> 
    </Col> 
    <Col> 
    </Col> 
    <Col> 
    </Col> 

    </Row>
    <Row className='mt-1'>
    <Col> 
    </Col> 
    <Col> 
    </Col> 
    <Col> 
    </Col> 
    <Col> 
    </Col> 

    </Row>

    </Container>
  );
}

export default Evaluations;
