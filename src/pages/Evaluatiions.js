import React, { useState, useEffect } from 'react';
import '../css/App.css';
import { Container, Button, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config/config';
import GridEval from '../charts/GridEval';

const evalColumns = [
  { field: 'id', headerName: 'ID', width: 50 },

  {
    field: 'no',
    headerName: 'No.',
    width: 70,
    editable: true,
  },
  {
    field: 'applicant_name',
    headerName: 'Name Applicant',
    width: 150,
    editable: true,
  },
  {
    field: 'month',
    headerName: 'Month',
    width: 100,
    editable: true,
  },
  {
    field: 'applicant_area',
    headerName: 'Name Area',
    width: 120,
    editable: true,
  },
  {
    field: 'test_type',
    headerName: 'Experience',
    width: 100,
    editable: true,
  },
  {
    field: 'no_ambassador',
    headerName: 'No Ambassador',
    width: 90,
    editable: true,
  },
  {
    field: 'full_name',
    headerName: 'Name Ambassador',
    width: 150,
    editable: true,
  },
  {
    field: 'company',
    headerName: 'Company',
    width: 150,
    editable: true,
  },
  {
    field: 'position',
    headerName: 'Position',
    width: 90,
    editable: true,
  },
  {
    field: 'base',
    headerName: 'Base',
    width: 70,
    editable: true,
  },
  {
    field: 'company_email',
    headerName: 'Company Email',
    width: 150,
    editable: true,
  },
  {
    field: 'flight_hours',
    headerName: 'Flight Hours',
    width: 90,
    editable: true,
  },
  {
    field: 'rtari_level',
    headerName: 'RTARI 4,5,6',
    width: 120,
    editable: true,
  },
  {
    field: 'first_exam',
    headerName: '1º Exam.',
    width: 110,
    editable: true,
  },
  {
    field: 'time',
    headerName: 'Hour',
    width: 110,
    editable: true,
  },
  {
    field: 'exam_calif',
    headerName: 'Calification',
    width: 50,
    editable: true,
  },
  {
    field: 'result',
    headerName: 'Result',
    width: 90,
    editable: true,
  },
];

function Evaluations() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('temp');
  const [consulEval, setConsulEval] = useState([]);

  const saveFile = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    } else {
      // restablecer el estado y el nombre del archivo si se cancela la selección si no, dara error
      setFile(null);
      setFileName('temp');
    }
  };

  const uploadFile = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Select a file please');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    try {
      const res = await axios.post(`${API_URL}/uploadfile`, formData);

      if (res.status === 200 && res.data.code === 'SUCCESS') {
        alert(`Excel file processed successfully ${res.data.message}`);
      } else if (res.data.code === 'NO_PROCCESS') {
        alert(`${res.data.error}.`);
      } else if (res.status === 500 && res.data.code === 'DB_INSERT_ERR') {
        alert(`${res.data.message}`);
      }
    } catch (ex) {
      console.log(ex);
      alert(
        `An error occurred while processing your request. Error: ${ex.message}`
      );
    }
  };

  const getEvalData = async () => {
    try {
      const response = await axios.get(`${API_URL}/getDataEvaluations`, {});
      setConsulEval(response.data);
      console.log('informacion obtenida');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEvalData();
  }, []);

  const rows = consulEval.map((row, index) => ({
    id: index,
    ...row,
  }));

  //borrar Evaluation
  const handleDelete = async (id) => {
    if (window.confirm('seguro quiere borrar este usuario?')) {
      // Intenta eliminar al usuario de la base de datos
      await axios.delete(`${API_URL}/deleteEvaluation/${id}`);

      // Si se tiene éxito, actualiza el estado para eliminar al usuario de la vista
      setConsulEval(consulEval.filter((user) => user.id !== id));

      // Aquí puedes mostrar un mensaje de éxito si lo deseas
      alert('Usuario eliminado correctamente');
    }
    try {
    } catch (err) {
      // Aquí puedes manejar cualquier error que pueda ocurrir
      console.error(err);
      alert('Hubo un error al eliminar al usuario');
    }
  };

  return (
    <>
      <Container className='container-custom'>
        <h1>Evaluations</h1>
        <Row className='mt-4'>
          <Col className='mt-3' lg={{ span: 10 }}>
            <Form.Group controlId='formFileLg' className='mb-3'>
              <Form.Label>Upload Consolidate Evaluations Excel</Form.Label>
              <Form.Control type='file' size='md' onChange={saveFile} />
            </Form.Group>
          </Col>
          <Col className='mt-5' lg={{ span: 2 }}>
            <Button variant='outline-success' onClick={uploadFile}>
              Upload
            </Button>
          </Col>
        </Row>
      </Container>
      <div className='evaluation-grid'>
        <div className='mt-5 mb-3 center-text'>
          <h1>Evaluations Historic</h1>
        </div>
        <GridEval
          rows={rows}
          columnsVar={evalColumns}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}

export default Evaluations;
