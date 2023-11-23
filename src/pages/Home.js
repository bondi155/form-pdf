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

const colorsNumeric = [
  '#0000FF', // 1 - Azul
  '#4B0082', // 2 - Índigo
  '#8A2BE2', // 3 - Azul violeta
  '#7B68EE', // 4 - Azul acero medio
  '#00008B', // 5 - Azul oscuro
  '#8B008B', // 6 - Magenta oscuro
  '#9400D3', // 7 - Violeta oscuro
];
const colorsAlphabetic = [
  '#008000', // A - Verde
  '#FFD700', // B - Dorado
  '#FFA500', // B+ - Naranja
  '#FF8C00', // B- - Rojo naranja oscuro
  '#FF0000', // C+ - Naranja suave
  '#FFA07A', // C - Rojo
  '#000000', // C- - Negro
  '#D2691E', // D - Chocolate
  '#FFC0CB', // NP - Rosa claro
];

function Home({ form }) {
  const [totalCalif, setTotalCalif] = useState(0);
  const [breakdown, setBreakdown] = useState({});
  const [error, setError] = useState(null); //pongo el error en un state para mostrarlo en pantalla
  const [companiesRow, SetCompaniesRow] = useState([]);
  const domainParts = form.username.split('@')[1].split('.');
  const domainName = domainParts[0];
  const [currentDomain, setCurrentDomain] = useState(domainName);
  const [dateEval, setDateEval] = useState([]);

  const labelsNumerics = ['2', '3', '4', '5', '6']; //, '7'
  const labelsAlphabets = ['A', 'B', 'B+', 'B-', 'C', 'NP'];
  const labelsAlphabetsTsm = ['A', 'B', 'B+', 'C', 'D'];

  //Ejecutamos las 2 funciones ya que tienen las mismas dependencias
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        if (form.role === 'admin' && currentDomain === 'admin') {
          const companiesRes = await axios.get(`${API_URL}/getCompanies`, {});
          SetCompaniesRow(companiesRes.data);
        } else {
          const response = await axios.get(`${API_URL}/examData`, {
            params: {
              domainName: currentDomain,
            },
          });
          setTotalCalif(response.data.total);
          setBreakdown(response.data.breakdown);
        }
      } catch (err) {
        setError(
          err.message ||
            'Ocurrió un error al obtener los datos de las empresas y sus KPI`s.'
        );
      }
    };
    fetchExamData();
    const fetchDateEval = async () => {
      try {
        const response = await axios.get(`${API_URL}/getDateEval`, {
          params: {
            domainName: currentDomain,
          },
        });
        setDateEval(response.data);
      } catch (err) {
        setError(
          err.message || 'Ocurrió un error al obtener los datos del date'
        );
      }
    };
    fetchDateEval();
  }, [currentDomain, form.role]);
  //console.log(dateEval);
  //console.log(companiesRow);

  //ACA DEberiamos agregar los otros resultados pero deben coincidir con el registro
  //por ejemplo Cancelado, hay 1 , podriamos ponerlo ..
  const order = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    'A',
    'B',
    'B+',
    'B-',
    'C',
    'D',
    'NP',
  ];
  const orderedBreakdown = {};

  order.forEach((key) => {
    if (breakdown[key]) {
      orderedBreakdown[key] = breakdown[key];
    }
  });
  //console.log(currentDomain);
  // Dividir el objeto orderedBreakdown en numéricos y alfabéticos
  const numericBreakdown = {};
  const alphabeticBreakdown = {};

  Object.entries(orderedBreakdown).forEach(([key, value]) => {
    if (['1', '2', '3', '4', '5', '6', '7'].includes(key)) {
      numericBreakdown[key] = value;
    } else {
      alphabeticBreakdown[key] = value;
    }
  });
  //valores del array , los otros son los labels
  const numericValues = Object.values(numericBreakdown);
  const alphabeticValues = Object.values(alphabeticBreakdown);
  return (
    <>
      <Container className='container-custom'>
        {error ? (
          <div>
            Hubo un problema cargando los graficos..error: Recargue la pagina
            por favor{error}
          </div>
        ) : form.role === 'admin' ? (
          //pantalla para Administrador
          <div>
            {' '}
            <Card
              className='mb-3'
              style={{
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f8f9fa', // Un gris claro
              }}
            >
              <Card.Header className='d-flex align-items-center'>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <h4>
                    <FaUserCircle className='mb-2' size={35} /> Bienvenido
                    Administrador <strong>{form.username}</strong>
                  </h4>
                </Col>
              </Card.Header>
              <Card.Body>
                {currentDomain === 'admin' ? (
                  <>
                    {' '}
                    <small>
                      Como administrador tendras accesso a los datos de todas
                      las empresas :{' '}
                    </small>{' '}
                  </>
                ) : (
                  <Row>
                    {/* Tarjeta para la Total de Evaluaciones */}
                    <Col xs={12} sm={6} lg={6}>
                      <Card>
                        <Card.Body>
                          <Card.Title>Total de Evaluaciones</Card.Title>
                          <div>
                            <strong>{currentDomain}</strong> desde{' '}
                            <strong>01/2023</strong>
                            <h2>{totalCalif}</h2>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    {/* Tarjeta para la Última Evaluación */}
                    <Col xs={12} sm={6} lg={6}>
                      <Card>
                        <Card.Body>
                          <Card.Title>Última Evaluación</Card.Title>
                          {dateEval.map((month, key) => (
                            <div key={key}>
                              <strong>{month.full_name}</strong>
                              <h2>{month.first_exam}</h2>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                )}
                <Row>
                  <Form.Group className='mt-2' controlId='companySelector'>
                    <Form.Control
                      as='select'
                      onChange={(e) => setCurrentDomain(e.target.value)}
                    >
                      <option value='admin'>Seleccione una Empresa</option>
                      {companiesRow.map((admin, key) => (
                        <option key={key} value={admin.company}>
                          {admin.company}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Row>
              </Card.Body>
            </Card>
            {numericValues &&
            numericValues.length > 0 &&
            currentDomain !== 'admin' ? (
              <>
                <Row className='chartsCont'>
                  <Col xs={12} lg={5} sm={12} md={10}>
                    <PieChart
                      key='numericChart'
                      className='pie-chart-card'
                      title='Calificaciones Numéricas'
                      labelsValue={labelsNumerics}
                      seriesValues={numericValues}
                      colorsValue={colorsNumeric}
                      width={360}
                      chartTitle={'Sin Experiencia desde 01/2023'}
                    />
                  </Col>
                  <Col xs={12} lg={5} sm={12} md={10}>
                    <PieChart
                      key='alphabeticChart'
                      className='pie-chart-card'
                      title='Calificaciones Alfabéticas'
                      labelsValue={labelsAlphabets}
                      seriesValues={alphabeticValues}
                      colorsValue={colorsAlphabetic}
                      width={360}
                      chartTitle={'Con Experiencia desde 01/2023'}
                    />
                  </Col>
                </Row>
              </>
            ) : (
              alphabeticValues &&
              currentDomain !== 'admin' &&
              alphabeticValues.length > 0 && (
                <Row className='chartsCont'>
                  <Col xs={12} lg={5} sm={12} md={10}>
                    <PieChart
                      key='alphabeticChartSolo'
                      className='pie-chart-card-large'
                      labelsValue={labelsAlphabetsTsm}
                      seriesValues={alphabeticValues}
                      colorsValue={colorsAlphabetic}
                      width={350}
                      chartTitle={'Con Experiencia desde 01/2023'}
                    />
                  </Col>
                </Row>
              )
            )}
          </div>
        ) : form.role === 'company' ? (
          //pantalla para clientes
          <div>
            {' '}
            <Card
              className='mb-3'
              style={{
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f8f9fa', // Un gris claro
              }}
            >
              <Card.Header>
                <FaUserCircle className='mb-2' size={35} /> Bienvenido{' '}
                <strong>{form.username}</strong>
              </Card.Header>
              <Card.Body>
                <Row>
                  {/* Tarjeta para el Total de Evaluaciones */}
                  <Col xs={12} sm={6} lg={6}>
                    <Card>
                      <Card.Body>
                        <Card.Title>Total de Evaluaciones</Card.Title>
                        <div>
                          <strong>{domainName}</strong> desde{' '}
                          <strong>01/2023</strong>
                          <h2>{totalCalif}</h2>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  {/* Tarjeta para la Última Evaluación */}
                  <Col xs={12} sm={6} lg={6}>
                    <Card>
                      <Card.Body>
                        <Card.Title>Última Evaluación</Card.Title>
                        {dateEval.map((month, key) => (
                          <div key={key}>
                            <strong>{month.full_name}</strong>
                            <h2>{month.first_exam}</h2>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            {numericValues && numericValues.length > 0 ? (
              <>
                <Row className='chartsCont'>
                  <Col xs={12} lg={5} sm={11} md={10}>
                    <PieChart
                      key='numericChart'
                      className='pie-chart-card'
                      title='Calificaciones Numéricas'
                      labelsValue={labelsNumerics}
                      seriesValues={numericValues}
                      colorsValue={colorsNumeric}
                      width={360}
                      chartTitle={'Sin Experiencia desde 01/2023'}
                    />
                  </Col>
                  <Col xs={12} lg={5} sm={12} md={10}>
                    <PieChart
                      key='alphabeticChart'
                      className='pie-chart-card'
                      title='Calificaciones Alfabéticas'
                      labelsValue={labelsAlphabets}
                      seriesValues={alphabeticValues}
                      colorsValue={colorsAlphabetic}
                      width={360}
                      chartTitle={'Con Experiencia desde 01/2023'}
                    />
                  </Col>
                </Row>
              </>
            ) : (
              alphabeticValues &&
              alphabeticValues.length > 0 && (
                <div className='d-flex justify-content-center'>
                  <Col xs={12} lg={5} sm={12} md={10}>
                    <PieChart
                      key='alphabeticChartSolo'
                      className='pie-chart-card-large'
                      labelsValue={labelsAlphabetsTsm}
                      seriesValues={alphabeticValues}
                      colorsValue={colorsAlphabetic}
                      width={360}
                      chartTitle={'Con Experiencia desde 01/2023'}
                    />
                  </Col>
                </div>
              )
            )}
          </div>
        ) : (
          <>
            <Card
              className='mb-3'
              style={{
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f8f9fa', // Un gris claro
              }}
            >
              <Card.Header className='d-flex align-items-center'>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <FaUserCircle className='mb-2' size={35} /> Welcome{' '}
                  <strong>{form.username}</strong>
                </Col>
              </Card.Header>
              <Card.Body>  <div className='d-flex justify-content-center'>
              <Link to='/reportCard'>
                <Button variant='dark'>Create a New Report Card</Button>
              </Link>
            </div></Card.Body>
            </Card>
          
          </>
        )}
      </Container>
      {form.role === 'company' && (
        <div>
          <Container>
            <Row>
              <Col md={12} lg={{ span: 10, offset: 1 }}>
                <ListEval
                  form={form}
                  titulotd1={domainName === 'tsm' ? 'No. ' : 'No. Embajador'}
                  titulotd2={domainName === 'tsm' ? 'Celular' : 'T.Prueba'}
                />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
}

export default Home;
