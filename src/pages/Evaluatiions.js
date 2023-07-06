import React, { useState } from 'react';
import '../css/App.css';
import { Container, Button, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config/config';
import GridEval from '../charts/GridEval';

function Evaluations() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('temp');

  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
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
      alert(`An error occurred while processing your request. Error: ${ex.message}`);
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
        <GridEval />
      </div>
    </>
  );
}

export default Evaluations;
