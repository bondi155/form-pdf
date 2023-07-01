import React, { useState } from 'react';
import '../css/App.css';
import {
  Container,
  Button,
  Row,
  Col,
  Form
} from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config/config';

function Evaluations() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };
  
  const uploadFile = async (e) => {
    e.preventDefault();

    if (!file) {
      console.log('No se ha seleccionado ningún archivo.');
      alert('Select a file please');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);

    try {
      const res = await axios.post(`${API_URL}/uploadfile`, formData);
      console.log(res);
      alert(`Archivo ${fileName}, subido correctamente.`);
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <Container className='container-custom'>
      <h1>Evaluations</h1>
      <Row className='mt-4'>
        <Col>
          <Form.Group controlId='formFileLg' className='mb-3'>
            <Form.Label>Upload Consolidate Evaluations Excel</Form.Label>
            <Form.Control type='file' size='md' onChange={saveFile} />
          </Form.Group>
          <Button variant='primary' onClick={uploadFile}>
            Upload
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Evaluations;
