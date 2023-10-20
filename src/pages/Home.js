import React, { useState, useEffect } from 'react';
import '../css/App.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config/config';
import { FaUserCircle } from 'react-icons/fa';
import PieChart from '../charts/PieChart';
import { Link } from 'react-router-dom';
import ListEval from '../components/ListEval';
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

  const labelsNumerics = ['2', '3', '4', '5', '6']; //, '6', '7'
  const labelsAlphabets = ['A', 'B', 'B+', 'B-', 'C', 'NP'];
  const labelsAlphabetsTsm = ['A', 'B', 'B+', 'C', 'D'];

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
        setError(err.message || 'Ocurrió un error al obtener los datos.');
      }
    };
    fetchExamData();
  }, [currentDomain, form.role]);

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

  //const valor = [44, 55, 13, 43, 22, 44, 55, 13, 43, 22, 44, 55, 13, 43, 22, 77]

  return (
    <>
      <Container className='container-custom'>
        {error ? (
          <div>Hubo un problema cargando los graficos..error: {error}</div>
        ) : form.role === 'admin' ? (
          //pantalla para Administrador
          <div>
            {' '}
            <Card
              className='mb-3'
              style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
            >
              <Card.Header className='d-flex align-items-center'>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <h4>
                    <FaUserCircle className='mb-2' size={35} /> Bienvenido
                    Administrador <strong>{form.username}</strong>
                  </h4>
                  <small>
                    Como administrador tendras accesso a los datos de todas las
                    empresas.{' '}
                    <div className='mt-2 mb-2'>
                    <Link to='/evaluationData'>
                      <Button size='sm' variant='success'>
                        Ver Evaluations UleadAir
                      </Button>
                    </Link>
                  </div>
                  </small>
                  <p>
                    Última evaluación: <strong>Octubre</strong>
                  </p>
                
                
                </Col>
              </Card.Header>
              <Card.Body>
                {currentDomain === 'admin' ? <> <h4>Seleccione Empresa :</h4></> :
                  <h5>
                  Total de Evaluaciones para <strong>{currentDomain}</strong>{' '} desde
                   <strong> 01/2023</strong>: <strong>{totalCalif}</strong> 
                </h5>
                 }
                <Row>
                  {companiesRow.map((admin, key) => {
                    return (
                      <Col key={key} sm={3} xs={3} lg={1} md={2} className='mb-2 mt-2'>
                        <Button
                          variant='outline-dark'
                          onClick={() => setCurrentDomain(admin.company)}
                        >
                          {admin.company}
                        </Button>
                      </Col>
                    );
                  })}
                </Row>
              </Card.Body>
            </Card>
            {numericValues && numericValues.length > 0 ? (
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
        ) : (
          //pantalla para clientes
          <div>
            {' '}
            <Card
              className='mb-3'
              style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
            >
              <Card.Header className='d-flex align-items-center'>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <h4>
                    <FaUserCircle className='mb-2' size={35} /> Bienvenido{' '}
                    <strong> {form.username}</strong>
                  </h4>
                  <p>
                    Última evaluación: <strong>Octubre</strong>
                  </p>
                  <div className='mt-2 mb-2'></div>
                </Col>
              </Card.Header>
              <Card.Body>
                <h5>
                  Total de Evaluaciones en <strong>{domainName}</strong> desde{' '}
                  <strong>01/2023</strong>:
                </h5>
                <h2>
                  <strong>{totalCalif}</strong>
                </h2>
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
        )}
      </Container>
      {domainName !== 'admin' && (
        <div className='d-flex justify-content-center'>
          <Container>
            <ListEval
              form={form}
              titulotd1={domainName === 'tsm' ? 'No. ' : 'No. Embajador'}
              titulotd2={domainName === 'tsm' ? 'Celular' : 'T.Prueba'}
            />
          </Container>
        </div>
      )}
    </>
  );
}

export default Home;
