import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import '../css/App.css';
import { API_URL } from '../config/config.js';
import axios from 'axios';
import Swal from 'sweetalert2';
import PlaneSpinner from '../components/planeSpinner';

function ReportCard({ form }) {
  const [isLoading, setIsLoading] = useState(false);
  const [reportState, setReportState] = useState({
    titulo: '',
    proyecto: '',
    n_proy: '',
    estado: '',
    pdn_01: '',
    cod_proy_01: '',
    est_mun: '',
    uap: '',
    nom_resp: '',
    acuerdo: '',
    desc_acuer: '',
    udf_01: '',
    num_decreto: '',
    ley: '',
    desc_capitulo: '',
    cod_proy_pdn: '',
    an_pag_01: '',
    an_pag_02: '',
    an_pag_03: '',
    re_rev: '',
    pruebas: '',
  });

  const handleUserInput = (e) => {
    setReportState({
      ...reportState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_URL}/fillPdf`,
        { reportState },
        { responseType: 'blob' }
      );

      const filename = `${reportState.n_proy}_${reportState.titulo}.pdf`;
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.parentNode.removeChild(link);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      Swal.fire('Ooops', 'ERROR generating Report Card PDF', 'error');
      console.log(err);
    }
  };

  return (
    <>
      {isLoading ? (
        <PlaneSpinner />
      ) : (
        <Container className='container-custom'>
          <Form onSubmit={handleSubmit}>
            {isLoading && <PlaneSpinner />}
            <Card className='mb-2'>
              <Card.Header>
                <h2> Formulario Libro Blanco</h2>
              </Card.Header>
              <Card.Body>
                {/* Encabezado del Documento */}
                <Card.Title>
                  <strong>I. Introducción</strong>
                </Card.Title>
                <Row className='mb-2'>
                  <Col md={6} lg={6} sm={12} xs={12}>
                    <Form.Group controlId='titulo'>
                      <Form.Control
                        type='text'
                        name='titulo'
                        placeholder='Ingrese el Titulo del Documento'
                        value={reportState.titulo}
                        onChange={handleUserInput}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} lg={6} sm={12} xs={12}>
                    <Form.Group controlId='proyecto'>
                      <Form.Control
                        type='text'
                        name='proyecto'
                        placeholder='Ingrese Descripción del Proyecto'
                        value={reportState.proyecto}
                        onChange={handleUserInput}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Card.Title>
                  <strong> II. Presentación</strong>
                </Card.Title>
                <Card.Text className='text-muted'><strong> a) Nombre y Objetivo del Proyecto</strong></Card.Text>
                {/* Nombre y Objetivo del Proyecto */}
                <Row className='mb-2'>
                  <Col md={4} lg={4} sm={12} xs={12}>
                    <Form.Group controlId='n_proy'>
                      <Form.Control
                        type='text'
                        name='n_proy'
                        placeholder='Ingrese el Nombre del proyecto'
                        value={reportState.n_proy}
                        onChange={handleUserInput}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} lg={4} sm={12} xs={12}>
                    <Form.Group controlId='estado'>
                      <Form.Control
                        type='text'
                        name='estado'
                        placeholder='Ingrese el Estado o Municipio'
                        value={reportState.estado}
                        onChange={handleUserInput}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} lg={4} sm={12} xs={12}>
                    <Form.Group controlId='pdn_01'>
                      <Form.Control
                        type='text'
                        name='pdn_01'
                        placeholder='Ingrese el código de PDN'
                        value={reportState.pdn_01}
                        onChange={handleUserInput}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* PDN, Código de proyecto, etc. */}
                <Row className='mb-2'>
                  <Card.Text className='text-muted'> <strong> b) Beneficiarios</strong></Card.Text>
                  <Col md={6} lg={6} sm={12} xs={12}>
                    <Form.Group controlId='cod_proy_01'>
                      <Form.Control
                        type='text'
                        name='cod_proy_01'
                        placeholder='Ingrese el código de proyecto'
                        value={reportState.cod_proy_01}
                        onChange={handleUserInput}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} lg={6} sm={12} xs={12}>
                    <Form.Group controlId='est_mun'>
                      <Form.Control
                        type='text'
                        name='est_mun'
                        placeholder='Ingrese el Alcaldia o Estado'
                        value={reportState.est_mun}
                        onChange={handleUserInput}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Card.Text className='text-muted'> <strong>e) Unidades Administrativas Participantes</strong></Card.Text>
                {/* UAP, Nombre del responsable, etc. */}
                <Row className='mb-2'>
                  <Col md={6} lg={6} sm={12} xs={12}>
                    <Form.Group controlId='uap'>
                      <Form.Control
                        type='text'
                        name='uap'
                        placeholder='Unidad Administrativa Participante'
                        value={reportState.uap}
                        onChange={handleUserInput}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Card.Text className='text-muted'> <strong> 
                  F) Nombre de la Pesrsona Titular de la Dependencia o Entidad</strong>
                </Card.Text>
                <Row className='mb-4'>
                  <Col md={6} lg={6} sm={12} xs={12}>
                    <Form.Group controlId='nom_resp'>
                      <Form.Control
                        type='text'
                        name='nom_resp'
                        placeholder='Ingrese Nombre y Puesto de la persona Responsable'
                        value={reportState.nom_resp}
                        onChange={handleUserInput}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Card.Title>
                  <strong>
                    III. Fundamento legal y objetivo del libro blanco
                  </strong>
                </Card.Title>
                <Row className='mb-3'>
                  <Col md={4} lg={4} sm={12} xs={12}>
                    <Form.Group controlId='acuerdo'>
                      <Form.Control
                        type='text'
                        name='acuerdo'
                        placeholder='Ingrese el número o código de acuerdo'
                        value={reportState.acuerdo}
                        onChange={handleUserInput}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Card.Title>
                  <strong>IV. Antecedentes</strong>
                </Card.Title>
                {/* Continuación de campos adicionales */}
                <Row className='mb-3'>
                  <Col md={10} lg={10} sm={12} xs={12}>
                    <Form.Group controlId='desc_acuer'>
                      <Form.Control
                        as='textarea'
                        name='desc_acuer'
                        placeholder='Ingrese la Descripción del Acuerdo'
                        value={reportState.desc_acuer}
                        onChange={handleUserInput}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2} lg={2} sm={12} xs={12}>
                    <Form.Group controlId='udf_01'>
                      <Form.Control
                        type='text'
                        name='udf_01'
                        placeholder='UDF 01'
                        value={reportState.udf_01}
                        onChange={handleUserInput}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Card.Title>
                  <strong>V. Marco normativo aplicable</strong>
                </Card.Title>
                <Row className='mb-3'>
                  <Col md={3} lg={3} sm={12} xs={12}>
                    <Form.Group controlId='num_decreto'>
                      <Form.Control
                        type='text'
                        name='num_decreto'
                        placeholder='Ingrese el número de decreto'
                        value={reportState.num_decreto}
                        onChange={handleUserInput}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3} lg={3} sm={12} xs={12}>
                    <Form.Group controlId='ley'>
                      <Form.Control
                        type='text'
                        name='ley'
                        placeholder='Ingrese la ley '
                        value={reportState.ley}
                        onChange={handleUserInput}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3} lg={3} sm={12} xs={12}>
                    <Form.Group controlId='desc_capitulo'>
                      <Form.Control
                        type='text'
                        name='desc_capitulo'
                        placeholder='Ingrese el capítulo de la ley'
                        value={reportState.desc_capitulo}
                        onChange={handleUserInput}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3} lg={3} sm={12} xs={12}>
                    <Form.Group controlId='cod_proy_pdn'>
                      <Form.Control
                        type='text'
                        name='cod_proy_pdn'
                        placeholder='Ingrese el cód. proyecto y de la PDN'
                        value={reportState.cod_proy_pdn}
                        onChange={handleUserInput}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Card.Title>
                  <strong>VIII. Acciones Realizadas</strong>
                </Card.Title>
                <Row className='mb-3'>
                  <Col md={2} lg={3} sm={12} xs={12}>
                    <Form.Group controlId='an_pag_01'>
                      <Form.Control
                        type='text'
                        name='an_pag_01'
                        placeholder='Año y pagina 01'
                        value={reportState.an_pag_01}
                        onChange={handleUserInput}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2} lg={3} sm={12} xs={12}>
                    <Form.Group controlId='an_pag_02'>
                      <Form.Control
                        type='text'
                        name='an_pag_02'
                        placeholder='Año y pagina 02'
                        value={reportState.an_pag_02}
                        onChange={handleUserInput}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2} lg={3} sm={12} xs={12}>
                    <Form.Group controlId='an_pag_03'>
                      <Form.Control
                        type='text'
                        name='an_pag_03'
                        placeholder='Año y pagina 03'
                        value={reportState.an_pag_03}
                        onChange={handleUserInput}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} lg={3} sm={12} xs={12}>
                    <Form.Group controlId='re_rev'>
                      <Form.Control
                        type='text'
                        name='re_rev'
                        placeholder='Ingrese el estado'
                        value={reportState.re_rev}
                        onChange={handleUserInput}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Card.Title>
                    <strong>X. Resultados y Beneficios Alcanzados</strong>
                  </Card.Title>
                  <Col md={12} lg={12} sm={12} xs={12}>
                    <Form.Group controlId='pruebas'>
                      <Form.Control
                        as='textarea'
                        name='pruebas'
                        placeholder='Ingrese la descripción y criterios de las pruebas que se realizaron'
                        value={reportState.pruebas}
                        onChange={handleUserInput}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                {/* Botón de Envío */}
                <Row>
                  <Col xs={12}>
                    <Button
                      type='submit'
                      variant='primary'
                      className='mt-3 mb-2 mx-auto d-block'
                    >
                      Guardar
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer className='text-muted mt-2'>
                <p className='text-center'>
                  Luego de enviar el formulario, automáticamente se generará el
                  PDF con sus datos.
                </p>
              </Card.Footer>
            </Card>
          </Form>
        </Container>
      )}
    </>
  );
}

export default ReportCard;
