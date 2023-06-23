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
  Accordion,
  Form,
} from 'react-bootstrap';
import Percentage from '../charts/Percentage';
import volaris from '../components/img/airlines/volaris.png';
import aeromexico from '../components/img/airlines/aeromexico.png';

const PersonalData = () => {
  const [personalData, setPersonalData] = useState([]);
  const [email, setEmail] = useState('');


  const [personalForm, setPersonalForm] = useState({
    full_name: '',
    personal_email: '',
    cellphone: '',
    age: '',
    country: '',
    course: '',
    flight_hours: '',
    flight_status: '',
    experience: '',
    type_airc: '',
    company: '',
    company_email: '',
    rtari_level: '',
    rtari_expires: '',
    english_status: '',
    hours_english: '',
    level_english: '',
    other_career: '',
    contact: '',
    option_pay: '',
    date_form: '',
  });

  //submit con fecha
  const handleSubmit = (event) => {
    event.preventDefault();
    const currentDate = new Date();
    setPersonalForm({ ...personalForm, date_form: currentDate.toISOString() });
    // Aquí puedes realizar otras acciones, como enviar los datos a la API
  };

  const handleInputChange = (event) => {
    setPersonalForm({
      ...personalForm,
      [event.target.name]: event.target.value,
    });
  };

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
      alert('El campo de correo electrónico no puede estar vacío');
    } else {
      fetchPerData();
    }
  };

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
      <h1 className='mb-4'>Personal Data</h1>
      <Accordion defaultActiveKey='0'>
        <Accordion.Item eventKey='0'>
          <Accordion.Header>Insert Manually Data Form </Accordion.Header>
          <Accordion.Body>
            <Container fluid className='w-100 pers-container'>
              <Form>
                <Row className='mb-2'>
                  <Col className='mt-2' xs={12} md={4}>
                    <Form.Group controlId='formEmail'>
                      <Form.Label>Personal Email</Form.Label>
                      <Form.Control
                        type='email'
                        required
                        name='personal_email'
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} className='mt-2' md={4}>
                    <Form.Group controlId='formName'>
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type='text'
                        required
                        name='full_name'
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} className='mt-2' md={4}>
                    <Form.Group controlId='formLastName1'>
                      <Form.Label>Course</Form.Label>
                      <Form.Control
                        type='text'
                        name='course'
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className='mb-2'>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formLastName2'>
                      <Form.Label>Age</Form.Label>
                      <Form.Control
                        type='text'
                        name='age'
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formPhone'>
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        type='country'
                        name='cellphone'
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formCell'>
                      <Form.Label>Cellphone</Form.Label>
                      <Form.Control
                        type='tel'
                        required
                        name='cell'
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className='mb-2'>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formOtherEmail'>
                      <Form.Label>Company Email</Form.Label>
                      <Form.Control
                        type='email'
                        name='company_email'
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formTimeZone'>
                      <Form.Label>Flight Hours</Form.Label>
                      <Form.Control
                        as='select'
                        name='flight_hours'
                        onChange={handleInputChange}
                      >
                        {/* Insert Time Zone options here */}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formGender'>
                      <Form.Label>Flight Status</Form.Label>
                      <Form.Control
                        as='select'
                        name='flight_status'
                        onChange={handleInputChange}
                      >
                        {/* Insert Gender options here */}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className='mt-2 mb-2'>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formBirth'>
                      <Form.Label>Experience</Form.Label>
                      <Form.Control
                        type='text'
                        name='experience'
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formNationality'>
                      <Form.Label>Type Aircaft (separate by comma)</Form.Label>
                      <Form.Control
                        type='text'
                        name='type_airc'
                        onChange={handleInputChange}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formCountry'>
                      <Form.Label>Company</Form.Label>
                      <Form.Control
                        type='text'
                        name='company'
                        onChange={handleInputChange}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className='mb-2'>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formAddress'>
                      <Form.Label>Company Email</Form.Label>
                      <Form.Control
                        type='text'
                        name='company_email'
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formPostalCode'>
                      <Form.Label>Rtari Level</Form.Label>
                      <Form.Control
                        type='text'
                        name='rtari_level'
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formCompany'>
                      <Form.Label>Rtari Expires</Form.Label>
                      <Form.Control
                        type='text'
                        name='rtari_expires'
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formCompany'>
                      <Form.Label>English Status</Form.Label>
                      <Form.Control
                        type='text'
                        name='english_status'
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={4}>
                    <Form.Group controlId='formCompany'>
                      <Form.Label>Hours English</Form.Label>
                      <Form.Control
                        type='text'
                        name='hours_english'
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={4}>
                    <Form.Group controlId='formCompany'>
                      <Form.Label>Level English</Form.Label>
                      <Form.Control
                        type='text'
                        name='level_english'
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formCompany'>
                      <Form.Label>Other Career</Form.Label>
                      <Form.Control
                        type='text'
                        name='other_career'
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={4}>
                    <Form.Group controlId='formCompany'>
                      <Form.Label>Contact</Form.Label>
                      <Form.Control
                        type='text'
                        name='contact'
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={4}>
                    <Form.Group controlId='formCompany'>
                      <Form.Label>Option Payment</Form.Label>
                      <Form.Control
                        type='text'
                        name='option_pay'
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className='mt-3 mb-2  d-block mx-auto' xs={12} md={2}>
                    <Button variant='outline-secondary' size='sm' type='submit'>
                      Submit
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Container>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
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
                <Card.Title>{item.nombre}</Card.Title>
                <Card.Subtitle className='mb-2 text-muted'>
                  {renderImage(item.empresa)}
                </Card.Subtitle>
                <Card.Text>
                  Calification: <strong> {item.calif}</strong>
                </Card.Text>
                <Percentage />
                Course: {item.curso}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PersonalData;
