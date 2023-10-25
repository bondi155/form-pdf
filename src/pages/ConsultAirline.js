import React, { useEffect, useState } from 'react';
import GridEval from '../charts/GridEval';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config/config';
import images from '../components/Imagenes';

function ConsultAirline({ form }) {
  const domainParts = form.username.split('@')[1].split('.');
  const domainName = domainParts[0];

  const [companyEval, setCompanyEval] = useState([]);

  const columnVisibility =
    domainName === 'tsm'
      ? {
          test_type: false, // Ocultar la columna 'Experience' si es TSM
          no_ambassador: true, // Mostrar la columna 'No Ambassador' si es TSM
          flight_hours: false,
          company: false,
          base: false,
          applicant_area: false,
        }
      : domainName === 'volaris'
      ? {
          test_type: true, // Mostrar la columna 'Experience' si no es TSM
          no_ambassador: true, // Ocultar la columna 'No Ambassador' si no es TSM
          flight_hours: false,
          company: false,
          no: false,
        }
      : {
          test_type: true, // Mostrar la columna 'Experience' si no es TSM
          no_ambassador: false, // Ocultar la columna 'No Ambassador' si no es TSM
          flight_hours: false,
        };

  const noAmbassadorColumn = {
    field: 'no_ambassador',
    headerName: domainName === 'tsm' ? 'Celular' : 'No Embajador',
    width: 120,
  };

  const evalCompanyCol = [
    {
      field: 'no',
      headerName: 'No.',
      width: 100,
      hide: true,
    },
    {
      field: 'company',
      headerName: 'Compañia',
      width: 90,
    },
    {
      field: 'applicant_name',
      headerName: 'Solicitante',
      width: 120,
    },
    {
      field: 'month',
      headerName: 'Mes',
      width: 50,
      hide: true,
    },
    {
      field: 'applicant_area',
      headerName: 'Area',
      width: 140,
    },
    {
      field: 'test_type',
      headerName: 'Tipo de Prueba',
      width: 130,
    },
    {
      field: 'full_name',
      headerName: 'Nombre Completo',
      width: 250,
    },
    {
      field: 'evaluaciones',
      headerName: 'Evaluaciones',
      width: 90,
      align: 'center',
    },
    {
      field: 'position',
      headerName: 'Posición',
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
      headerName: 'Correo de empresa',
      width: 210,
    },
    {
      field: 'flight_hours',
      headerName: 'Horas de Vuelo',
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
      headerName: 'Fecha',
      width: 110,
    },
    {
      field: 'time',
      headerName: 'Hora',
      width: 120,
    },
    {
      field: 'exam_calif',
      headerName: 'Calif.',
      width: 50,
    },
    {
      field: 'result',
      headerName: 'Resultado',
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

  if (domainName === 'volaris') {
    evalCompanyCol.unshift(noAmbassadorColumn);
  } else {
    // Puedes insertar la columna 'no_ambassador' en la posición que desees.
    // Por ejemplo, para insertarla en la sexta posición:
    evalCompanyCol.splice(5, 0, noAmbassadorColumn);
  }

  const GetEvalCompany = async () => {
    try {
      const response = await axios.get(`${API_URL}/companyEval`, {
        params: {
          domainName,
        },
      });
      //  console.log(response.data);
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
      <Container className='container-custom-company'>
        <Row>
          <h1 className='text-center mt-5'>
            Consulta de Evaluaciones{' '}
            {domainName === 'tsm' ? (
              <img src={images.tsm} width='25%' alt='tsm' />
            ) : domainName === 'volaris' ? (
              <img src={images.volaris} alt='volaris' width='15%' />
            ) : null}{' '}
          </h1>
        </Row>
      </Container>
      <GridEval
        rows={rows}
        columnsVar={evalCompanyCol}
        fileNameVar='EvaluationsCompany'
        columnVisibility={columnVisibility}
      />
    </>
  );
}

export default ConsultAirline;
