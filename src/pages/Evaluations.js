import React, { useState, useEffect } from 'react';
import '../css/App.css';
import {
  Container,
  Button,
  Row,
  Col,
  Form,
  Modal,
  FormControl,
  InputGroup,
} from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config/config';
import GridEval from '../charts/GridEval';
import Swal from 'sweetalert2';
import { FaPencilAlt, FaCheck, FaComments } from 'react-icons/fa';

//import { BsFillCloudUploadFill } from 'react-icons/bs';

//modal comments
function CommentModal({ comment }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <FaComments
        color='grey'
        size={30}
        onClick={handleShow}
        style={{ cursor: 'pointer', marginLeft: '20px' }}
      />

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
//subir pdf report card
/*const handlePdfUpload = (e, id) => {
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
*/
function Evaluations() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('temp');
  const [consulEval, setConsulEval] = useState([]);
  const [reportUrl, setReportUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [isEditingCalif, setIsEditingCalif] = useState(false);
  const [editingCalifRowId, setEditingCalifRowId] = useState(null);

  const evalColumns = [
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
      width: 50,
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
      width: 150,
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
      width: 80,
      renderCell: (params) => {
        const handleEditCalifClick = () => {
          setIsEditingCalif(true);
          setEditingCalifRowId(params.row.id);
        };

        const handleSaveCalifClick = () => {
          updateCalif(params.row.id, params.row.exam_calif);
          setIsEditingCalif(false);
          setEditingCalifRowId(null);
        };

        if (isEditingCalif && editingCalifRowId === params.row.id) {
          return (
            <div>
              <InputGroup className='mb-3 mt-4'>
                <FormControl
                  type='text'
                  size='sm'
                  defaultValue={params.row.exam_calif}
                  onChange={(e) => {
                    params.row.exam_calif = e.target.value; // Actualizamos el valor en la fila
                  }}
                />
                <FaCheck
                  className='mb-3 mt-3'
                  color='green'
                  size={20}
                  onClick={handleSaveCalifClick}
                  style={{ marginLeft: '5px', cursor: 'pointer' }}
                />
              </InputGroup>
            </div>
          );
        } else {
          return (
            <div>
              {params.row.exam_calif}
              <FaPencilAlt
                color='grey'
                size={15}
                onClick={handleEditCalifClick}
                style={{ marginLeft: '5px', cursor: 'pointer' }}
              />
            </div>
          );
        }
      },
    },

    {
      field: 'result',
      headerName: 'Result',
      width: 90,
    },
    /*
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
    */
    {
      field: 'report_url',
      headerName: 'Report Card Link',
      width: 245,
      renderCell: (params) => {
        const handleEditClick = () => {
          setIsEditing(true);
          setEditingRowId(params.row.id);
        };

        const handleSaveClick = () => {
          updateReportUrl(params.row.id);
          setIsEditing(false);
          setEditingRowId(null);
        };

        // Si no hay report_url y no estamos en modo edición para esta fila.
        if (
          !params.row.report_url &&
          !(isEditing && editingRowId === params.row.id)
        ) {
          return (
            <InputGroup className='mb-3 mt-4'>
              <FormControl
                type='text'
                defaultValue={params.row.report_url}
                onChange={(e) => setReportUrl(e.target.value)}
                style={{ width: '70%' }}
              />

              <FaCheck
                color='green'
                size={20}
                onClick={() => updateReportUrl(params.row.id)}
                style={{
                  marginLeft: '5px',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                }}
              />
            </InputGroup>
          );
        }

        // Si estamos en modo edición para esta fila.
        else if (isEditing && editingRowId === params.row.id) {
          return (
            <InputGroup className='mb-3 mt-4'>
              <FormControl
                type='text'
                defaultValue={params.row.report_url}
                onChange={(e) => setReportUrl(e.target.value)}
                style={{ width: '70%' }}
              />
              <FaCheck
                color='green'
                size={20}
                onClick={handleSaveClick}
                style={{
                  marginLeft: '5px',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                }}
              />
            </InputGroup>
          );
        }

        // Si hay un report_url y no estamos en modo edición para esta fila.
        else {
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
                  <FaPencilAlt
                    color='grey'
                    size={15}
                    onClick={handleEditClick}
                    style={{
                      marginLeft: '5px',
                      cursor: 'pointer',
                      marginBottom: '0.5rem',
                    }}
                  />
                </div>
              )}
            </div>
          );
        }
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

  //upload Excel evaluations
  const uploadFile = async (e) => {
    e.preventDefault();

    if (!file) {
      Swal.fire('Select a file please');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    try {
      const res = await axios.post(`${API_URL}/uploadfile`, formData);

      if (res.status === 200 && res.data.code === 'SUCCESS') {
        Swal.fire(
          'Good job!',
          `Excel file processed successfully ${res.data.message}`,
          'success'
        );
        //alert(`Excel file processed successfully ${res.data.message}`);
      } else if (res.data.code === 'NO_PROCCESS') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${res.data.error}.`,
        });
        // alert(`${res.data.error}.`);
      } else if (res.status === 500 && res.data.code === 'DB_INSERT_ERR') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${res.data.message}.`,
        });
        //  alert(`${res.data.message}`);
      }
    } catch (ex) {
      // console.log(ex);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `An error occurred while processing your request. Error: ${ex.message}`,
      });
    }
  };

  //update url row
  const updateReportUrl = async (id) => {
    try {
      await axios.put(`${API_URL}/reportUrl/${id}`, {
        urlDrive: reportUrl,
      });
      Swal.fire('Good job!', 'URL updated!!', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire(':( !', ' The URL could not be updated', 'error');
    }
  };

  //get eval data from db
  const getEvalData = async () => {
    try {
      const response = await axios.get(`${API_URL}/getDataEvaluations`, {});
      setConsulEval(response.data);
      //console.log('informacion obtenida');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Security Message',
          text: 'Token expire, please login again',
        });
      } else {
        console.error(err);
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
        Swal.fire(
          'Deleted!',
          'The Evaluation Row has been deleted.',
          'success'
        );
      }
    });
    try {
    } catch (err) {
      // Aquí puedes manejar cualquier error que pueda ocurrir
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There was an error deleting the evaluation row',
      });
    }
  };

  

  const updateCalif = async (id, newCalif) => {
    try {
      await axios.put(`${API_URL}/editCalif`, {
        id: id,
        newValue: newCalif,
      });
      Swal.fire(
        'Good job!', 'Calification updated!!', 'success'
      );
    } catch (err) {
      console.error(err);
      Swal.fire(':( !', ' The Calification could not be updated', 'error');
    }
  };

  return (
    <>
      <Container className='container-custom'>
        <h1>Evaluations</h1>
        <Row className='mt-2'>
          <Col className='mt-3' xs={12} sm={10} lg={10}>
            <Form.Group controlId='formFileLg' className='mb-3'>
              <Form.Label>Consolidate Evaluations Info</Form.Label>
              <Form.Control type='file' size='md' onChange={saveFile} />
            </Form.Group>
          </Col>
          <Col
            className='mt-5'
            xs={{ offset: 4 }}
            sm={{ span: 2, offset: 0 }}
            lg={{ span: 2, offset: 0 }}
          >
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
          fileNameVar='EvaluationListComplete'
          onDelete={handleDelete}
          onUpdateReportUrl={updateReportUrl}
          showDeleteColumn={true}
        />
      </div>
    </>
  );
}

export default Evaluations;
