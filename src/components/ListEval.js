import React, { useState, useEffect } from 'react';
import '../css/App.css';
import { Container, Row, Col, Table, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config/config';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function ListEval({ form, titulotd1, titulotd2 }) {
  const domainParts = form.username.split('@')[1].split('.');
  const domainName = domainParts[0];

  const [ListHome, setListHome] = useState([]);

  const GetList = async () => {
    try {
      const listResponse = await axios.get(`${API_URL}/listLastEvals`, {
        params: {
          domainName,
        },
      });
      setListHome(listResponse.data);
    } catch (error) {
      console.error(error);
      Swal.fire('Ooops', 'Unable to get data', 'error');
    }
  };

  useEffect(() => {
    GetList();
    //no depende de ninguna const
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Container className='container-table-list'> 
    <div className='mt-4 mb-2 table-list'>
      <Card>
        <Card.Header>
          <h2>
            <strong>Últimas Evaluaciones</strong>{' '}
            <Link to='/consultAirlineGrid'>
              <Button size='sm' variant='dark'>
                Ver Todos los registros
              </Button>
            </Link>
          </h2>
        </Card.Header>
        <Table id='myTable' size='sm' overflow='scroll' responsive bordered hover >
          <thead>
            <tr>
              <th>{titulotd1}</th>
              <th>Nombre Completo</th>
              <th>{titulotd2}</th>
              <th>Fecha</th>
              <th>Calificación</th>
              <th>Resultado</th>
              <th>Reporte</th>
            </tr>
          </thead>
          <tbody>
            {ListHome.map((consul, key) => {
              return (
                <tr key={key}>
                  {domainName === 'volaris' ? (
                    <td><strong> {consul.no_ambassador}</strong></td>
                  ) : (
                    <td>
                      <strong>{consul.no}</strong>
                    </td>
                  )}
                  <td>{consul.full_name}</td>
                  {domainName === 'volaris' ? (
                    <td>{consul.test_type}</td>
                  ) : (
                    <td>{consul.no_ambassador}</td>
                  )}
                  <td>{consul.first_exam}</td>

                  <td style={{ textAlign: 'center' }}>
                    <strong>{consul.exam_calif}</strong>
                  </td>
                  <td>{consul.result}</td>
                  <td>
                    <a
                      href={consul.report_url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                     Report Card
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Card.Footer className='text-muted'>Actualizado en el último inicio de sesión..</Card.Footer>
      </Card>
    </div>
    </ Container> 
  );
}
export default ListEval;
