import React, { useState, useEffect } from 'react';
import '../css/App.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config/config';
import { FaUserCircle } from 'react-icons/fa';
import PieChart from '../charts/PieChart';
import { Link } from 'react-router-dom';

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

  const labelsNumerics = ['1', '2', '3', '4', '5', '6', '7'];
  const labelsAlphabets = ['A', 'B', 'B+', 'B-', 'C', 'C+'];
  const labelsAlphabetsTsm = ['A', 'B', 'B+','C', 'D'];

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        if (domainName === 'admin'){
          const companiesRes = await axios.get(`${API_URL}/getCompanies`,{
           });
           SetCompaniesRow(companiesRes.data);
          } else { 
        const response = await axios.get(`${API_URL}/examData`, {
          params: {
            domainName,
          },
        });
        setTotalCalif(response.data.total);
        setBreakdown(response.data.breakdown);
      }
      } catch (err) {
        setError(err.message || 'Ocurrió un error al obtener los datos.');
      }
    };

    fetchExamData();
  }, [domainName]);

  const order = [
    '1',
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
    'C+',
    'C-',
    'D',
    'NP',
  ];
  const orderedBreakdown = {};

  order.forEach((key) => {
    if (breakdown[key]) {
      orderedBreakdown[key] = breakdown[key];
    }
  });

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

  //const valor = [44, 55, 13, 43, 22, 44, 55, 13, 43, 22, 44, 55, 13, 43, 22, 77]
  
  return (
    <Container className='container-custom'>
      <Row>
        {error ? (
          <div>Hubo un problema cargando los graficos..error: {error}</div>
        ) : domainName === 'admin' ? (
          <Col
          xs={{ span: 10, offset: 1 }}
          sm={{ span: 12, offset: 0 }}
          lg={{ span: 12, offset: 0 }}
          md={{ span: 12, offset: 0 }}
        >
          {' '}
          <Card
            className='mb-3'
            border='dark'
            style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
          >
            <Card.Header className='d-flex align-items-center'>
              <FaUserCircle size={40} style={{ marginRight: '16px' }} />{' '}
              <div>
                <h4>Bienvenido Administrador {form.username}</h4>
                <small>Como administrador tendras accesso a los datos de todas las empresas: </small>
                <br/>
                <small>Última evaluación: <strong>1 Septiembre</strong></small>

              </div>
            </Card.Header>
            <Card.Body>
              <h5>Total de Evaluaciones en {domainName}:</h5>
              <h2>
                <strong> {totalCalif}</strong>
              </h2>
              {/* Opcional: agregar aquí barra de progreso o gráfico */}
              <div>
              <Link to='/evaluationData'>
                <Button variant='primary'>Ver Evaluations UleadAir</Button>
            </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        ) : (
          <div>
            <Col
              xs={{ span: 10, offset: 1 }}
              sm={{ span: 12, offset: 0 }}
              lg={{ span: 12, offset: 0 }}
              md={{ span: 12, offset: 0 }}
            >
              {' '}
              <Card
                className='mb-3'
                border='dark'
                style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
              >
                <Card.Header className='d-flex align-items-center'>
                  <FaUserCircle size={40} style={{ marginRight: '16px' }} />{' '}
                  <div>
                    <h4>Bienvenido, {form.username}</h4>
                    <small>Última evaluación: <strong>1 Septiembre</strong></small>
                  </div>
                </Card.Header>
                <Card.Body>
                  <h5>Total de Evaluaciones en {domainName} <strong>2023</strong>:</h5>
                  <h2>
                    <strong> {totalCalif}</strong>
                  </h2>
                  {/* Opcional: agregar aquí barra de progreso o gráfico */}
                  <div>
                  <Link to='/consultAirlineGrid'>
                <Button variant='primary'>Ver detalles</Button>
            </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Row>
              {numericValues && numericValues.length > 0 ? (
                <>
                  <Row className='chartsCont'>
                    <Col xs={12} lg={6} sm={12} md={6}>
                      <PieChart
                        className='pie-chart-card'
                        title='Calificaciones Numéricas'
                        labelsValue={labelsNumerics}
                        seriesValues={numericValues}
                        colorsValue={colorsNumeric}
                        width={380}
                        chartTitle={'Sin Experiencia 2023'}
                      />
                    </Col>
                    <Col xs={12} lg={6} sm={12} md={6}>
                      <PieChart
                        className='pie-chart-card'
                        title='Calificaciones Alfabéticas'
                        labelsValue={labelsAlphabets}
                        seriesValues={alphabeticValues}
                        colorsValue={colorsAlphabetic}
                        width={380}
                        chartTitle={'Con Experiencia 2023'}
                      />
                    </Col>
                  </Row>
                </>
              ) : (
                <Row className='chartsCont'>
                  <Col xs={12} lg={{ span: 8, offset: 1 }} sm={12} md={12}>
                    <PieChart
                      className='pie-chart-card-large'
                      labelsValue={labelsAlphabetsTsm}
                      seriesValues={alphabeticValues}
                      colorsValue={colorsAlphabetic}
                      width={500}
                      chartTitle={'Con Experiencia 2023'}
                    />
                  </Col>
                </Row>
              )}
            </Row>
            {/*  <ul>
              {Object.entries(breakdown).map(([key, value]) => (
                <li key={key}>
                  {key}: {value}
                </li>
              ))}
            </ul>
            */}
          </div>
        )}
      </Row>
    </Container>
  );
}

export default Home;
