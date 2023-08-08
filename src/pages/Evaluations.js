import React, { useState, useEffect } from 'react';
import '../css/App.css';
import { Container, Button, Row, Col, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config/config';
import GridEval from '../charts/GridEval';
import Swal from 'sweetalert2';
import { BsFillCloudUploadFill } from 'react-icons/bs';

function CommentModal({ comment }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button size='sm' variant="success" onClick={handleShow}>
        Comment{' '}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>{comment}</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const evalColumns = [
  { field: 'id', headerName: 'ID', width: 50 },

  {
    field: 'no',
    headerName: 'No.',
    width: 70,
    editable: true,
  },
  {
    field: 'company',
    headerName: 'Company',
    width: 90,
    editable: true,
  },
  {
    field: 'applicant_name',
    headerName: 'Applicant',
    width: 120,
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
    headerName: 'Area',
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
  {
    field: 'upload',
    headerName: 'Upload Pdf',
    width: 100,

    renderCell: (params) => (
      <div className='file_input'>
        <input
          id={`file_btn_${params.row.id}`}
          className='file-btn'
          type='file'
          onChange={(e) => handlePdfUpload(e, params.row.id)}
        />
        <label htmlFor={`file_btn_${params.row.id}`}>
          <BsFillCloudUploadFill size={30} style={{ cursor: 'pointer' }} />
        </label>
      </div>
    ),
  },
  {
    field: 'report_url',
    headerName: 'Report',
    width: 130,
    renderCell: (params) => {
      if (!params.value) {
        return <span>No Report</span>; // O cualquier otra cosa que quieras mostrar cuando no haya una URL
      }

      const correctedUrl = `${API_URL}/${params.value.replace('\\', '/')}`;
      //console.log(`URL: ${correctedUrl}`);

      return (
        <a href={correctedUrl} download>
          Download Report
        </a>
      );
    },
  },
  {
    field: 'comments',
    headerName: 'Comments',
    width: 100,
    renderCell: (params) => {
      if (!params.row.comments) {
        return <span>No comments</span>;
      } else {
        return <CommentModal comment={params.row.comments} />;
      }
    },
  },
];

//subir pdf report card
const handlePdfUpload = (e, id) => {
  const file = e.target.files[0];
  console.log(id);
  const formData = new FormData();
  formData.append('file', file);
  if (!file) {
    alert('Vuelva a seleccionar un archivo ');
  }
  try {
    axios.post(`${API_URL}/uploadReport/${id}`, formData);
    console.log('upload success');
    alert('upload success');
  } catch (err) {
    console.log(err);
    alert('error uploading file', err);
  }
};

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
  //get eval data from db
  const getEvalData = async () => {
    try {
      const response = await axios.get(`${API_URL}/getDataEvaluations`, {});
      setConsulEval(response.data);
      console.log('informacion obtenida');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Security Message',
          text: 'Token expire, please login again',
        });
      } else {
        console.log(err);
        Swal.fire('Ooops', 'Unable to get data', 'error');
      }
    }
  };

  useEffect(() => {
    getEvalData();
  }, []);

  const rows = consulEval.map((row) => ({
    id: row.id,
    comments: row.comments,
    ...row,
  }));

  //borrar Evaluation
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${API_URL}/deleteEvaluation/${id}`);
        setConsulEval(consulEval.filter((user) => user.id !== id));
        Swal.fire('Deleted!', 'The user has been deleted.', 'success');
      }
    });
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
        <hr></hr>
        <Row className='mt-2'>
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
