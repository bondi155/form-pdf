import React, { useEffect, useState } from 'react';
import GridEval from '../charts/GridEval';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config/config';
import images from '../components/Imagenes';

const evalCompanyCol = [
  { field: 'id', headerName: 'ID', width: 50, hide: true },

  {
    field: 'no',
    headerName: 'No.',
    width: 70,
    hide: true,
  },
  {
    field: 'company',
    headerName: 'Company',
    width: 90,
  },
  {
    field: 'applicant_name',
    headerName: 'Solicitor',
    width: 120,
  },
  {
    field: 'month',
    headerName: 'Month',
    width: 100,
    hide: true,
  },
  {
    field: 'applicant_area',
    headerName: 'Area',
    width: 120,
  },
  {
    field: 'test_type',
    headerName: 'Experience',
    width: 100,
  },
  {
    field: 'no_ambassador',
    headerName: 'No Ambassador',
    width: 90,
    hide: true,
  },
  {
    field: 'full_name',
    headerName: 'Full name',
    width: 250,
  },
  {
    field: 'position',
    headerName: 'Position',
    width: 90,
    hide: true,
  },
  {
    field: 'base',
    headerName: 'Base',
    width: 70,
  },
  {
    field: 'company_email',
    headerName: 'Company Email',
    width: 210,
  },
  {
    field: 'flight_hours',
    headerName: 'Flight Hours',
    width: 90,
  },
  {
    field: 'rtari_level',
    headerName: 'RTARI 4,5,6',
    width: 120,
    hide: true,
  },
  {
    field: 'first_exam',
    headerName: 'Date',
    width: 110,
  },
  {
    field: 'time',
    headerName: 'Time',
    width: 90,
  },
  {
    field: 'exam_calif',
    headerName: 'Grade',
    width: 50,
  },
  {
    field: 'result',
    headerName: 'Result',
    width: 90,
  },
  {
    field: 'report_url',
    headerName: 'Report Card Link',
    width: 245,
    renderCell: (params) => {
      // Si hay un report_url y no estamos en modo edición para esta fila.
      return (
        <div>
          {params.row.report_url && (
            <div>
              <a
                href={params.row.report_url}
                target='_blank'
                rel='noopener noreferrer'
              >
                View Report Card
              </a>
            </div>
          )}
        </div>
      );
    },
  },
];

function ConsultAirline({ form }) {
  const domainParts = form.username.split('@')[1].split('.');
  const domainName = domainParts[0];

  const [companyEval, setCompanyEval] = useState([]);

  const GetEvalCompany = async () => {
    try {
      const response = await axios.get(`${API_URL}/companyEval`, {
        params: {
          domainName,
        },
      });
      console.log(response.data);
      setCompanyEval(response.data);
      if (companyEval.length < 0) {
        alert('no hay array para estado');
      }
    } catch (error) {
      console.log(error);
      alert('error llamando eval por company');
    }
  };

  useEffect(() => {
    GetEvalCompany();
    //no es afectada por variables externas , solo el usuario que se reiniciaria en cada login
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = companyEval.map((row) => ({
    id: row.id,
    comments: row.comments,
    ...row,
  }));

  return (
    <>
      <Container className='container-custom'>
        <Row>
          <h1 className='text-center'>
            Consulta de Evaluaciones{' '}
            {domainName === 'tsm' ? (
              <img src={images.tsm} width='20%' alt='tsm' />
            ) : domainName === 'volaris' ? (
              <img src={images.volaris} alt='volaris' width='20%' />
            ) : null}{' '}
          </h1>
        </Row>
      </Container>
      <GridEval
        rows={rows}
        columnsVar={evalCompanyCol}
        fileNameVar='EvaluationsCompany'
      />
    </>
  );
}

export default ConsultAirline;
