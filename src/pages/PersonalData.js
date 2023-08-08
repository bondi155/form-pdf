import React, { useState, useEffect } from 'react';
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
  Dropdown,
  Tabs,
  Accordion,
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
  const [suggestions, setSuggestions] = useState([]);
  const [match, Setmatch] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [personalDataFromEffect, setPersonalDataFromEffect] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  // traemos info para personal_data . llamamos a la api..
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
        console.log(response.data);
        SetIsloading(false);
      } else {
        setPersonalData([]);
        Swal.fire({
          icon: 'info',
          title: 'There is no information for this email',
          showConfirmButton: false,
          timer: 2300,
        });
        SetIsloading(false);
      }
    } catch (err) {
      SetIsloading(false);
      Swal.fire('Ooops', 'Unable to get data', 'error');
      console.log(err);
    }
  };

  //muestra los datos del mail seleccionado en la lista con un click , del mapeo
  useEffect(() => {
    const fetchPerDataFromEffect = async (selectedEmail) => {
      const result = await axios.get(`${API_URL}/getPersonalData`, {
        params: {
          email: selectedEmail,
        },
      });

      if (Array.isArray(result.data)) {
        setPersonalDataFromEffect(result.data);
      } else {
      }
    };

    if (selectedEmail !== '') {
      fetchPerDataFromEffect(selectedEmail);
    }
  }, [selectedEmail]);

  //boton de search, variable suggestion si hace un match con algun elemento de la lista directamente muestra el dato
  const handleSearch = async () => {
    try {
      let suggestions = [];
      Setmatch(false);
      if (email === '') {
        Swal.fire({
          icon: 'info',
          title: 'Search term must have a value',
          showConfirmButton: false,
          timer: 1000,
        });
      } else if (email.includes('@')) {
        Setmatch(true);
        fetchPerData();
      } else {
        suggestions = await handleInputName(email);
        if (Array.isArray(suggestions)) {
          const exactMatch = suggestions.find(
            (suggestion) =>
              suggestion.name.toLowerCase() === email.toLowerCase()
          );
          if (exactMatch) {
            Setmatch(true);
            fetchPerData();
          }
        } else {
          Swal.fire({
            icon: 'info',
            title: 'No suggestions available',
            showConfirmButton: false,
            timer: 1000,
          });
        }
      }
    } catch (err) {
      SetIsloading(false);
      if (err.response && err.response.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Security Message',
          text: 'Token expire, please login again',
        });
      } else {
        Swal.fire(
          'Error!',
          'There was an connection error to Data Base',
          'error'
        );
      }
    }
  };

  // se activa el query con like y muestra los list names
  const handleInputName = async (email) => {
    if (email.length > 0) {
      try {
        const response = await axios.get(`${API_URL}/suggestNames`, {
          params: { email },
        });

        if (Array.isArray(response.data)) {
          setSuggestions(response.data);
          return response.data;
        }
      } catch (err) {
        Swal.fire('Ooops', 'Unable to get data', 'error');
        console.error('Error al obtener las sugerencias', err);
      }
    } else {
      setSuggestions([]);
      Swal.fire({
        icon: 'info',
        title: 'There is no coincidence',
        showConfirmButton: false,
        timer: 2300,
      });
      return [];
    }
  };

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
    } catch (err) {
      SetIsloading(false);
      if (err.response && err.response.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Security Message',
          text: 'Token expire, please login again',
        });
      } else {
        Swal.fire(
          'Error!',
          'There was an connection error to Google Sheets',
          'error'
        );
      }

      console.error('Error:', err);
    }
  };
  //mapear personal data el id . luego meter el id dentro de una funcion seteando selectid, luego ese sleect id = igual a id den el axios del put
  useEffect(() => {
    if (personalDataFromEffect.length > 0) {
        setSelectedId(personalDataFromEffect[0]?.pd_id);
    } else if (personalData.length > 0) {
        setSelectedId(personalData[0]?.pd_id);
    }
}, [personalData, personalDataFromEffect]);

  console.log("Selected ID:", selectedId);

  //actualizacion de comentario para cada id
  const handleSendComment = async () => {
    try {
      const response = await axios.put(`${API_URL}/updateComment`, {
        id: selectedId,
        comment: newComment,
      });
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Comment Updated',
        });
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'error',
      });
    }
  };

  function renderImage(empresa) {
    if (!empresa) {
      return 'No company charged in Forms';
    }

    if (empresa.toLowerCase() === 'volaris') {
      return <img src={volaris} width='7%' alt='Volaris' />;
    } else if (empresa.toLowerCase() === 'aeromexico') {
      return <img src={aeromexico} alt='Aeromexico' width='70%' />;
    } else if (empresa === 'sansa') {
      return <img src='/path/to/empresa2-image.jpg' alt='Empresa 2' />;
    }
  }

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

  //agrupo por course para que aparezcan diferentes pestañas
  const groupedData = (match ? personalData : personalDataFromEffect).reduce(
    (grouped, item) => {
      if (!grouped[item.course]) {
        grouped[item.course] = [];
      }
      grouped[item.course].push(item);
      return grouped;
    },
    {}
  );

  return (
    <Container className='container-custom'>
      <Row>
        <Col sm={6} lg={6} md={6}>
          <h1 className='mb-2'>Consolidate Information </h1>
        </Col>
        <Col sm={6} lg={4} md={6}>
          <InputGroup className='mb-3 mt-3'>
            <FormControl
              type='text'
              required
              placeholder='Tab name (Get students from Google Sheets)'
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
        <hr></hr>
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

      {email.length > 0 && suggestions.length > 0 && !match && (
        <Dropdown className='mb-3'>
          <Dropdown.Toggle variant='success' id='dropdown-basic'>
            Name Suggestions
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {suggestions.map((suggestion, index) => (
              <Dropdown.Item
                key={index}
                onClick={() => {
                  setSelectedEmail(suggestion.email);
                }}
              >
                {suggestion.name} - {suggestion.email}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}

      {isloading ? (
        <SpinnerComponent />
      ) : (
        <Row>
          <Tabs
            className='course-tab'
            defaultActiveKey={Object.keys(groupedData)[0]}
            id='tab-info'
          >
            {Object.entries(groupedData).map(([course, items], key) => (
              <Tab eventKey={course} title={course} key={key} >
                {items.map((item, innerKey) => (
                  <Col className='mb-2' sm={12} md={12} lg={12} key={innerKey}>
                    <Card className='data-container' onClick={() => setSelectedId(item.pd_id)}>
                      <Card.Body>
                        <Card.Title>
                          {item.pd_full_name}, {item.age}{' '}
                          {renderImage(item.pd_company)}{' '}
                          {renderCalif(item.calif)}
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
                                <ListGroup.Item action href='#link5'>
                                  Evaluation Information
                                </ListGroup.Item>
                                <ListGroup.Item action href='#link6'>
                                  Comments{' '}
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
                                      Cell phone:{' '}
                                      <strong> {item.cellphone}</strong>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                      Experience:{' '}
                                      <strong> {item.experience}</strong>
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
                                      Level:{' '}
                                      <strong>{item.level_english}</strong>
                                    </ListGroup.Item>
                                  </ListGroup>
                                </Tab.Pane>
                                <Tab.Pane eventKey='#link4'>
                                  <ListGroup>
                                    <ListGroup.Item>
                                      How meet us:{' '}
                                      <strong>{item.contact}</strong>
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
                                </Tab.Pane>{' '}
                                <Tab.Pane eventKey='#link5'>
                                  <Accordion>
                                    <Accordion.Item eventKey='0'>
                                      <Accordion.Header>
                                        Evaluations
                                      </Accordion.Header>
                                      <Accordion.Body>
                                        <ListGroup>
                                          <ListGroup.Item>
                                            Applicant Name:{' '}
                                            <strong>
                                              {' '}
                                              {item.ed_applicant_name}
                                            </strong>
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Month:{' '}
                                            <strong> {item.ed_month}</strong>
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Applicant Area:{' '}
                                            <strong>
                                              {' '}
                                              {item.ed_applicant_area}
                                            </strong>
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Test Type:{' '}
                                            <strong>{item.ed_test_type}</strong>
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Ambassador:{' '}
                                            <strong>
                                              {item.ed_no_ambassador}
                                            </strong>
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Full Name:{' '}
                                            <strong>{item.ed_full_name}</strong>
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Position:{' '}
                                            <strong> {item.ed_position}</strong>
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Base:{' '}
                                            <strong> {item.ed_bases}</strong>
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Company Email:{' '}
                                            <strong>
                                              {' '}
                                              {item.ed_company_emails}
                                            </strong>
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Flight Hours:{' '}
                                            <strong>
                                              {' '}
                                              {item.ed_flight_hours}
                                            </strong>
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            RTARI Level:{' '}
                                            <strong>
                                              {' '}
                                              {item.ed_rtari_levels}
                                            </strong>
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            First Exam:{' '}
                                            <strong>
                                              {' '}
                                              {item.ed_first_exams}
                                            </strong>
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Time:{' '}
                                            <strong> {item.ed_times}</strong>
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Exam Calification:{' '}
                                            <strong>
                                              {' '}
                                              {item.ed_exam_califs}
                                            </strong>
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Result:{' '}
                                            <strong> {item.ed_results}</strong>
                                          </ListGroup.Item>
                                        </ListGroup>
                                      </Accordion.Body>
                                    </Accordion.Item>
                                  </Accordion>
                                </Tab.Pane>
                                <Tab.Pane eventKey='#link6'>
                                  <ListGroup>
                                    <ListGroup.Item>
                                      {item.comments_pd ? (
                                        <strong>{item.comments_pd}</strong>
                                      ) : (
                                        <div>
                                          <InputGroup className='mb-3 mt-3'>
                                            <FormControl
                                              placeholder='Comment'
                                              size='sm'
                                              type='text'
                                              name='newComment'
                                              onChange={(e) =>
                                                setNewComment(e.target.value)
                                              }
                                            />
                                          <Button
                                            size='sm'
                                            variant='success'
                                            onClick={handleSendComment}
                                          >
                                            Send
                                          </Button>
                                          </InputGroup>

                                        </div>
                                      )}
                                      <strong>{item.comments_pd}</strong>
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
                ))}
              </Tab>
            ))}
          </Tabs>
        </Row>
      )}
    </Container>
  );
};

export default PersonalData;
