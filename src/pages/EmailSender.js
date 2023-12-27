import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { API_URL } from '../config/config.js';
import Swal from 'sweetalert2';
function EmailSender() {
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${API_URL}/sendEmails`, {
        params:{
          mes,
          anio,
        }
      });
      console.log(response.data);
      Swal.fire('Bien!', `Correos enviados ${mes}, Año: ${anio}`, 'success');
    } catch (err) {
      Swal.fire('Ooops', 'Error en enviar correos', 'error');
    }
  };

  return (
    <Container className='container-custom'>
      <Col xs={12} sm={12} lg={8} md={12}>
        <h1 className='mb-3'>Email Sender Calification</h1>
      </Col>
      <Row>
        <Form onSubmit={handleSubmit}>
          <Col lg={{ span: 6, offset: 3 }}>
            <Form.Group className='mb-2 mt-2' controlId='mesControlSelect'>
              <Form.Label>Selecciona un Mes</Form.Label>
              <Form.Control
                as='select'
                value={mes}
                onChange={(e) => setMes(e.target.value)}
              >
                <option value=''>Elige un mes...</option>
                <option value='Ene'>Enero</option>
                <option value='Feb'>Febrero</option>
                <option value='Mar'>Marzo</option>
                <option value='Abr'>Abril</option>
                <option value='May'>Mayo</option>
                <option value='Jun'>Junio</option>
                <option value='Jul'>Julio</option>
                <option value='Ago'>Agosto</option>
                <option value='Sep'>Septiembre</option>
                <option value='Oct'>Octubre</option>
                <option value='Nov'>Noviembre</option>
                <option value='Dic'>Diciembre</option>
                <option value='Prb'>prueba</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className='mb-2 mt-2' controlId='anioControlSelect'>
              <Form.Label>Selecciona un Año</Form.Label>
              <Form.Control
                as='select'
                value={anio}
                onChange={(e) => setAnio(e.target.value)}
              >
                <option value=''>Elige un año...</option>
                <option value='23'>2023</option>
                <option value='24'>2024</option>
                <option value='25'>2025</option>
                <option value='26'>2026</option>
                {/* Añade aquí más años */}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col lg={{ span: 2, offset: 8 }}>
            <Button
              variant='outline-secondary'
              onClick={handleSubmit}
              className='mt-4'
              type='submit'
            >
              Enviar Correos
            </Button>
          </Col>
        </Form>
      </Row>
    </Container>
  );
}

export default EmailSender;
