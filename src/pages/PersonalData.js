import React, { useState, useEffect } from 'react';
import {API_URL} from '../config/config.js';
import axios from 'axios';
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  FormControl,
  InputGroup,
} from 'react-bootstrap';
import Percentage from '../charts/Percentage';
import { useRecoilState } from 'recoil';
import { queryResults } from '../storage/GlobalStates';
import volaris from '../components/img/airlines/volaris.png';
import aeromexico from '../components/img/airlines/aeromexico.png';

const PersonalData = () => {
  const [personalData, setPersonalData] = useRecoilState(queryResults);
  const [email, setEmail] = useState('');

  const fetchPerData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/getPersonalData`,
        { params: { email } }
      );
      if (Array.isArray(response.data)) {
        setPersonalData(response.data);
      } else {
        setPersonalData([]);
        alert('There is no information for this email');
      }
      console.log(personalData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = () => {
    if (email === '') {
      alert('Email must have a value');
    } else {
      fetchPerData();
    }
  };

  const fetchSheetData = async () => {
    try {
      await axios.get(`${API_URL}/getDataSheets`);
      alert('Data Base updated with Sheets information!')
      console.log('API activada, base de datos actualizada');
    } catch (error) {
      console.error('Error:', error);
    }
  }
  

  function renderImage(empresa) {
    if (empresa.toLowerCase() === 'volaris') {
      return <img src={volaris} width='50%' alt='Volaris' />;
    } else if (empresa.toLowerCase() === 'aeromexico') {
      return <img src={aeromexico} alt='aeromexico' width='70%' />;
    } else if (empresa === 'empresa2') {
      return <img src='/path/to/empresa2-image.jpg' alt='Empresa 2' />;
    }
    // Agrega más condiciones aquí para las demás empresas
    // En caso de no encontrar ninguna coincidencia, la función retorna null
    return null;
  }
  return (
    <Container className='container-custom'>
      <h1 className='mb-4'>Personal Data  <Button
          variant='outline-secondary'
          size='sm'
          id='button-addon2'
          onClick={fetchSheetData}
        >
          Update Pilots
        </Button></h1>
      <InputGroup className='mb-3 mt-4'>
        <FormControl
          type='email'
          required
          placeholder='Search by email'
          aria-label='Search by email'
          aria-describedby='basic-addon2'
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          variant='outline-secondary'
          size='sm'
          id='button-addon2'
          onClick={handleSearch}
        >
          Search
        </Button>
      </InputGroup>
      <Row>
          {personalData.map((item) => (
            <Col className='mb-3' sm={4} key={item.id}>
              <Card style={{ width: '18rem', marginTop: '10px' }}>
                <Card.Body>
                  <Card.Title>{item.full_name}</Card.Title>
                  <Card.Subtitle className='mb-2 text-muted'>
                    {renderImage(item.company)}
                  </Card.Subtitle>
                  <Card.Text>
                    Calification: <strong> {item.calif}</strong>
                  </Card.Text>
                  <Percentage />
                  Course: {item.course}
                  Pay : {item.payment}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
  );
};

export default PersonalData;
