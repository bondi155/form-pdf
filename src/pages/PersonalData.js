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
  ListGroup,
  Tab,
} from 'react-bootstrap';
import Percentage from '../charts/Percentage';
import volaris from '../components/img/airlines/volaris.png';
import aeromexico from '../components/img/airlines/aeromexico.png';
import Swal from 'sweetalert2';
import images from '../components/Imagenes.js';
import SpinnerComponent from '../components/Spinner.js';

const PersonalData = () => {
  const [personalData, setPersonalData] = useState([]);
  const [email, setEmail] = useState('');
  const [tabName, SetTabName] = useState('');
  const [isloading, SetIsloading] = useState(false);
  const fetchPerData = async () => {
    try {
      SetIsloading(true);
      const response = await axios.get(`${API_URL}/getPersonalData`, {
        params: {
          email,
        },
      });
      if (Array.isArray(response.data)) {
        setPersonalData(response.data);
        SetIsloading(false);
      } else {
        setPersonalData([]);
        Swal.fire({
          icon: 'info',
          title: 'There is no information for this email',
          showConfirmButton: false,
          timer: 2300,
        });
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
      SetIsloading(true);
      const response = await axios.get(`${API_URL}/getDataSheets`, {
        tabName,
      });
      const emails = response.data.emails;
      const textEmails = `${emails}`;
      const Textduplicated = response.data.message;
      SetIsloading(false);

      if (response.data.code === 'INSERT_OKAY') {
        Swal.fire({
          icon: 'success',
          title: 'Google Sheets Information sent to Uleadair DataBase',
          text: textEmails,
        });
      } else if (response.data.code === 'DUPLICATED') {
        Swal.fire({
          icon: 'success',
          title: Textduplicated,
          text: textEmails,
        });
      }

      // Continuar con el resto del código...
    } catch (error) {
      Swal.fire(
        'Error!',
        'There was an error trying to get data from Sheets',
        'error'
      );

      console.error('Error:', error);
    }
  };

  //render imagenes empresa
  function renderImage(empresa) {
    // En caso de no encontrar ninguna coincidencia, la función retorna 'No company charged'

    if (!empresa) {
      return 'No company charged in Forms';
    }

    if (empresa.toLowerCase() === 'volaris') {
      return <img src={volaris} width='9%' alt='Volaris' />;
    } else if (empresa.toLowerCase() === 'aeromexico') {
      return <img src={aeromexico} alt='Aeromexico' width='70%' />;
    } else if (empresa === 'sansa') {
      return <img src='/path/to/empresa2-image.jpg' alt='Empresa 2' />;
    }
    // Agregar más condiciones aquí para las demás empresas
  }
  //render imagens calificationes.

  function renderCalif(calification) {
    if (!calification) {
      return 'No Calification';
    }

    if (calification.toLowerCase() === 'a') {
      return <img src={images.calif_a} width='9%' alt='A' />;
    } else if (calification.toLowerCase() === 'b') {
      return <img src={images.calif_b} width='9%' alt='B' />;
    } else if (calification.toLowerCase() === 'b+') {
      return <img src={images.calif_bmas} width='7%' alt='Bmas' />;
    } else if (calification.toLowerCase() === 'c') {
      return <img src={images.calif_c} width='9%' alt='C' />;
    } else if (calification.toLowerCase() === 'd') {
      return <img src={images.calif_d} width='9%' alt='D' />;
    }
  }
  return (
    <Container className='container-custom'>
      <Row>
        <Col sm={6} lg={4} md={6}>
          <h1 className='mb-4'>Personal Data </h1>
        </Col>
        <Col sm={6} lg={3} md={6}>
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
          type='text'
          placeholder='Search by name or email'
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
      {isloading ? (<SpinnerComponent/>) :(    

      <Row>
        {personalData.map((item, key) => (
          <div key={key}>
            <Col className='mb-5' sm={4} md={12} lg={12} key={item.id}>
              <Card className='data-container'>
                <Card.Body>
                  <Card.Title>
                    {item.pd_full_name}, {item.age}{' '}
                    {renderImage(item.pd_company)} {renderCalif(item.calif)}
                  </Card.Title>
                  <div className='components'>
                    <div>
                      <Percentage
                        seriesValue={item.asist}
                        labelOption={'Assistance'}
                      />
                    </div>
                    <div>
                      <Percentage
                        seriesValue={item.payment}
                        labelOption={'Pay'}
                      />
                    </div>
                  </div>
                  <Tab.Container
                    id='list-group-database-info'
                    defaultActiveKey='#link1'
                  >
                    <Row>
                      <Col sm={4}>
                        <ListGroup>
                          <ListGroup.Item action href='#link1'>
                            Course Information
                          </ListGroup.Item>
                          <ListGroup.Item action href='#link2'>
                            Pilot Information
                          </ListGroup.Item>
                          <ListGroup.Item action href='#link3'>
                            English Information
                          </ListGroup.Item>
                          <ListGroup.Item action href='#link4'>
                            Additional Information
                          </ListGroup.Item>
                        </ListGroup>
                      </Col>
                      <Col sm={8}>
                        <Tab.Content>
                          <Tab.Pane eventKey='#link1'>
                            <ListGroup>
                              <ListGroup.Item>
                                Course: <strong> {item.course}</strong>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                Start:<strong> {item.start_date}</strong>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                End: <strong> {item.end_date}</strong>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                Inscription Date:
                                <strong> {item.date_form}</strong>
                              </ListGroup.Item>
                            </ListGroup>
                          </Tab.Pane>
                          <Tab.Pane eventKey='#link2'>
                            <ListGroup>
                              <ListGroup.Item>
                                Country: <strong> {item.country}</strong>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                Cell phone: <strong> {item.cellphone}</strong>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                Experience: <strong> {item.experience}</strong>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                Rtari Level:{' '}
                                <strong>{item.pd_rtari_level}</strong>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                Rtari Expires:{' '}
                                <strong>{item.rtari_expires}</strong>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                Type of Aircraft:{' '}
                                <strong> {item.type_airc}</strong>
                              </ListGroup.Item>
                            </ListGroup>
                          </Tab.Pane>
                          <Tab.Pane eventKey='#link3'>
                            <ListGroup>
                              <ListGroup.Item>
                                Enlgish status:{' '}
                                <strong>{item.english_status}</strong>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                English Hours:
                                <strong> {item.hours_english}</strong>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                Level: <strong>{item.level_english}</strong>
                              </ListGroup.Item>
                            </ListGroup>
                          </Tab.Pane>
                          <Tab.Pane eventKey='#link4'>
                            <ListGroup>
                              <ListGroup.Item>
                                How meet us: <strong>{item.contact}</strong>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                Status:<strong> {item.status}</strong>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                Option of pay:{' '}
                                <strong>{item.option_pay}</strong>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                Company Email:{' '}
                                <strong>{item.company_email}</strong>
                              </ListGroup.Item>
                            </ListGroup>
                          </Tab.Pane>
                        </Tab.Content>
                      </Col>
                    </Row>
                  </Tab.Container>
                </Card.Body>
              </Card>
            </Col>
          </div>
        ))}
      </Row>
       )}
          </Container>
  );
};

export default PersonalData;
