import React, { useState } from 'react';
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
import aeromexico from '../components/img/airlines/aeromexico.png'

const PersonalData = () => {
  const [personalData, setPersonalData] = useState([]);
  const [email, setEmail] = useState('');

  const [personalForm, setPersonalForm] = useState({
    email: '',
    name: '',
    last_name1: '',
    last_name2: '',
    phone: '',
    cell: '',
    other_email: '',
    time_zone: '',
    gender: '',
    birth: '',
    nationality: '',
    country: '',
    address: '',
    postal_code: '',
    company: '',
  });

  const handleInputChange = (event) => {
    setPersonalForm({
      ...personalForm,
      [event.target.name]: event.target.value,
    });
  };

  const fetchPerData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5015/postPersonalData`,
        { params: { email } }
      );
      setPersonalData(response.data);
      console.log(personalData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = () => {
    fetchPerData();
  };

  //imagenes aerolineas 

  function renderImage(empresa) {
    if (empresa.toLowerCase() === "volaris") {
      return <img src={volaris} width='50%'alt="Volaris" />;
    } else if (empresa.toLowerCase() === "aeromexico") {
      return <img src={aeromexico} alt="aeromexico" width='70%' />;
    } else if (empresa === "empresa2") {
      return <img src="/path/to/empresa2-image.jpg" alt="Empresa 2" />;
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
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type='email'
                        name='email'
                        value={personalForm.email}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} className='mt-2' md={4}>
                    <Form.Group controlId='formName'>
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type='text'
                        name='name'
                        value={personalForm.name}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} className='mt-2' md={4}>
                    <Form.Group controlId='formLastName1'>
                      <Form.Label>Last Name 1</Form.Label>
                      <Form.Control
                        type='text'
                        name='last_name1'
                        value={personalForm.last_name1}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className='mb-2'>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formLastName2'>
                      <Form.Label>Last Name 2</Form.Label>
                      <Form.Control
                        type='text'
                        name='last_name2'
                        value={personalForm.last_name2}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formPhone'>
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type='tel'
                        name='phone'
                        value={personalForm.phone}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formCell'>
                      <Form.Label>Cell</Form.Label>
                      <Form.Control
                        type='tel'
                        name='cell'
                        value={personalForm.cell}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className='mb-2'>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formOtherEmail'>
                      <Form.Label>Other Email</Form.Label>
                      <Form.Control
                        type='email'
                        name='other_email'
                        value={personalForm.other_email}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formTimeZone'>
                      <Form.Label>Time Zone</Form.Label>
                      <Form.Control
                        as='select'
                        name='time_zone'
                        value={personalForm.time_zone}
                        onChange={handleInputChange}
                      >
                        {/* Insert Time Zone options here */}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formGender'>
                      <Form.Label>Gender</Form.Label>
                      <Form.Control
                        as='select'
                        name='gender'
                        value={personalForm.gender}
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
                      <Form.Label>Birth</Form.Label>
                      <Form.Control
                        type='date'
                        name='birth'
                        value={personalForm.birth}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formNationality'>
                      <Form.Label>Nationality</Form.Label>
                      <Form.Control
                        as='select'
                        name='nationality'
                        value={personalForm.nationality}
                        onChange={handleInputChange}
                      >
                        {/* Insert Nationality options here */}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formCountry'>
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        as='select'
                        name='country'
                        value={personalForm.country}
                        onChange={handleInputChange}
                      >
                        {/* Insert Country options here */}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className='mb-2'>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formAddress'>
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type='text'
                        name='address'
                        value={personalForm.address}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formPostalCode'>
                      <Form.Label>Postal Code</Form.Label>
                      <Form.Control
                        type='text'
                        name='postal_code'
                        value={personalForm.postal_code}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId='formCompany'>
                      <Form.Label>Company</Form.Label>
                      <Form.Control
                        type='text'
                        name='company'
                        value={personalForm.company}
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
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PersonalData;
