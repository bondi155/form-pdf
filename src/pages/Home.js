import React, { useState, useEffect } from 'react';
import '../css/App.css';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config/config';
import PieChart from '../charts/PieChart';
import { FaUserCircle } from 'react-icons/fa';

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

  const domainParts = form.username.split('@')[1].split('.');
  const domainName = domainParts[0];

  const labelsNumerics = ['1', '2', '3', '4', '5', '6', '7'];
  const labelsAlphabets = ['A', 'B', 'B+', 'B-', 'C', 'C+', 'C-', 'D', 'NP'];

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await axios.get(`${API_URL}/examData`, {
          params: {
            domainName,
          },
        });
        setTotalCalif(response.data.total);
        setBreakdown(response.data.breakdown);
      } catch (err) {
        setError(err.message || 'Ocurrió un error al obtener los datos.');
      }
    };

    fetchExamData();
    //no es afectada por variables externas , solo el usuario que se reiniciaria en cada login
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const numericValues = Object.values(numericBreakdown);
  const alphabeticValues = Object.values(alphabeticBreakdown);

  //const valor = [44, 55, 13, 43, 22, 44, 55, 13, 43, 22, 44, 55, 13, 43, 22, 77];
  return (
    <Container className='container-custom'>
      <Row>
        <Col
          xs={{ span: 10, offset: 1 }}
          sm={{ span: 12, offset: 0 }}
          lg={{ span: 8, offset: 0 }}
          md={{ span: 12, offset: 0 }}
        >
       <h1 className='mb-5'>Hola{' '}<FaUserCircle /> {form.username}
</h1>
        </Col>
        {error ? (
          <div>Error: {error}</div>
        ) : (
          <div>
            <h2 className='mb-5'>
              Total de Calificaciones en Evaluaciones: {totalCalif}
            </h2>
            <Row>
              <Col xs={12} lg={6} sm={12} md={12}>
                <PieChart
                  labelsValue={labelsNumerics}
                  seriesValues={numericValues}
                  colorsValue={colorsNumeric}
                />
              </Col>
              <Col xs={12} lg={6} sm={12} md={12}>
                <PieChart
                  labelsValue={labelsAlphabets}
                  seriesValues={alphabeticValues}
                  colorsValue={colorsAlphabetic}
                />
              </Col>
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
