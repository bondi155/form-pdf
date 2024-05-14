import React, { useState, useEffect } from 'react';
import '../css/App.css';
import {
  Container,
  Button,
  Row,
  Col,
  Form,
} from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config/config';
import GridEval from '../charts/GridEval';
import Swal from 'sweetalert2';

function Evaluations() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('temp');
  const [consulEval, setConsulEval] = useState([]);
  const [reportUrl, setReportUrl] = useState('');
 



  const evalColumns = [
    { field: 'id_libro', headerName: 'ID', width: 50, hide: true },

    {
      field: 'lb_nom_proyecto',
      headerName: 'Nombre Proyecto.',
      width: 150,
      hide: true,
    },
    {
      field: 'lb_municipio',
      headerName: 'Municipio',
      width:120,
    },
    {
      field: 'lb_cod_pdn_01',
      headerName: 'PDN',
      width: 130,
    },
    {
      field: 'lb_nom_responsable',
      headerName: 'Responsable',
      width:120,
      hide: true,
    }
  ];


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
    id: row.id_libro,
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


  return (
    <>
      <Container className='container-custom'>
        <h2>Libro Blanco</h2>
      </Container>
      <div className='evaluation-grid'>
        <div className='mt-5 mb-3 center-text'>
        </div>
        <GridEval
          rows={rows}
          columnsVar={evalColumns}
          fileNameVar='Libro Blanco'
          onDelete={handleDelete}
          showDeleteColumn={true}
        />
      </div>
    </>
  );
}

export default Evaluations;
