import React, { useState } from 'react';
import { API_URL } from '../config/config.js';
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
import Swal from 'sweetalert2';
const PersonalData = () => {
  const [personalData, setPersonalData] = useRecoilState(queryResults);
  const [email, setEmail] = useState('');
  const [tabName, SetTabName] = useState('');

  const fetchPerData = async () => {
    try {
      const response = await axios.get(`${API_URL}/getPersonalData`, {
        params: { email },
      });
      if (Array.isArray(response.data)) {
        setPersonalData(response.data);
      } else {
        setPersonalData([]);
        Swal.fire({
          icon: 'info',
          title: 'There is no information for this email',
          showConfirmButton: false,
          timer: 2300,
        }
        )
      }
      console.log(personalData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = () => {
    if (email === '') {
      Swal.fire({
        icon: 'info',
        title: 'Email must have a value',
        showConfirmButton: false,
        timer: 1000,
      });
    } else {
      fetchPerData();
    }
  };

  //data desde el sheet segunda funcion de api en server.js
  const fetchSheetData = async () => {
    try {
      await axios.get(`${API_URL}/getDataSheets`, {
        tabName,
      });
      Swal.fire({
        icon: 'success',
        title: 'Info for Google Sheets sent to Uleadair Data Base',
        showConfirmButton: false,
        timer: 2300,
      });
    } catch (error) {
      Swal.fire(
        'Error!',
        'There was a error trying get data from Sheets',
        'error'
      );

      console.error('Error:', error);
    }
  };

  function renderImage(empresa) {
    // En caso de no encontrar ninguna coincidencia, la función retorna 'No company charged'

    if (!empresa) {
      return 'No company charged in Forms';
    }

    if (empresa.toLowerCase() === 'volaris') {
      return <img src={volaris} width='50%' alt='Volaris' />;
    } else if (empresa.toLowerCase() === 'aeromexico') {
      return <img src={aeromexico} alt='aeromexico' width='70%' />;
    } else if (empresa === 'empresa2') {
      return <img src='/path/to/empresa2-image.jpg' alt='Empresa 2' />;
    }
    // Agregar más condiciones aquí para las demás empresas
  }
  return (
    <Container className='container-custom'>
      <Row>
        <Col md={{ span: 4 }}>
          <h1 className='mb-4'>Personal Data </h1>
        </Col>
        <Col md={{ span: 3 }}>
          {tabName}
          <InputGroup className='mb-3 mt-3'>
            <FormControl
              type='text'
              required
              placeholder='Set course and get pilots'
              aria-label='Set Course'
              aria-describedby='basic-addon2'
              size='sm'
              onChange={(e) => SetTabName(e.target.value.toUpperCase())}
            />
            <Button
              variant='outline-success'
              size='sm'
              id='button-addon2'
              onClick={fetchSheetData}
            >
              Go
            </Button>
          </InputGroup>
        </Col>
      </Row>
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
