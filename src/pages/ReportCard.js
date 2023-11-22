import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import '../css/App.css';
import { API_URL } from '../config/config.js';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import Swal from 'sweetalert2';
import { TfiHandPointDown } from 'react-icons/tfi';
import PlaneSpinner from '../components/planeSpinner';

const calificacionesOrdenadas = {
  A: 5,
  'B+': 4,
  B: 3,
  C: 2,
  D: 1,
};
function ReportCard() {
  const [isloading, SetIsloading] = useState(false);
  const [reportState, setReportState] = useState({
    full_name: '',
    company: '',
    controller: '',
    airport: '',
    date: '',
    age: '',
    flight_hours: '',
    rtari: '',
    rutine_comm: '',
    communications: '',
    message_structure: '',
    fluency: '',
    fluency_dialogue: '',
    pronunciation: '',
    comprehension: '',
    interaction: '',
    structure: '',
    vocabulary: '',
    plain_english: '',
    standard_phrase: '',
    final_grade: '',
    observations: '',
  });

  const getVocabularyOptions = () => {
    switch (reportState.message_structure) {
      case 'A':
        return ['A', 'B+'];
      case 'B':
        return ['B', 'C'];
      case 'B+':
        return ['B+', 'B'];
      case 'C':
        return ['B', 'C', 'D'];
      default:
        return []; // O cualquier opción por defecto
    }
  };

  const getCommuniOptions = () => {
    switch (reportState.communications) {
      case 'A':
        return ['A', 'B+'];
      case 'B':
        return ['B', 'C'];
      case 'B+':
        return ['B+', 'B'];
      case 'C':
        return ['B', 'C', 'D'];
      default:
        return []; // O cualquier opción por defecto
    }
  };

  const handleUserInput = (e) => {
    setReportState({
      ...reportState,
      [e.target.name]: e.target.value,
    });

    // Llama a la función para actualizar plain_english si es uno de los campos relevantes
    if (camposRelevantes.includes(e.target.name)) {
      actualizarCalificaciones(e.target.name, e.target.value);
    }
  };

  const actualizarCalificaciones = (campo, valor) => {
    const calificacionesActualizadas = {
      ...reportState,
      [campo]: valor,
    };

    // Calcular la calificación más baja para plain_english
    const calificacionMasBajaPlainEnglish = camposRelevantes
      .map((campo) => calificacionesActualizadas[campo])
      .filter((calificacion) => calificacion in calificacionesOrdenadas)
      .reduce((lowest, current) => {
        return calificacionesOrdenadas[current] <
          calificacionesOrdenadas[lowest]
          ? current
          : lowest;
      }, 'A');

    // Calcular la calificación más baja para aviation english final grade
    const calificacionesParaFinalGrade = [
      calificacionesActualizadas['standard_phrase'],
      calificacionMasBajaPlainEnglish,
    ].filter((calificacion) => calificacion in calificacionesOrdenadas);

    const calificacionMasBajaFinalGrade = calificacionesParaFinalGrade.reduce(
      (lowest, current) => {
        return calificacionesOrdenadas[current] <
          calificacionesOrdenadas[lowest]
          ? current
          : lowest;
      },
      'A'
    );

    // Actualizar el estado con ambas calificaciones más bajas
    setReportState((prevState) => ({
      ...prevState,
      plain_english: calificacionMasBajaPlainEnglish,
      final_grade: calificacionMasBajaFinalGrade,
    }));
  };

  const camposRelevantes = [
    'rutine_comm',
    'structure',
    'vocabulary',
    'pronunciation',
    'comprehension',
    'interaction',
    'fluency_dialogue',
    'fluency',
  ];

  const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    border: '4px solid #4f80bd',
    borderRadius: '15px',
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    border: '0.2px solid grey',
    
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const handleSubmit = async (e) => {
    e.preventDefault(); // Esto debería ir al principio para prevenir la acción por defecto en cualquier caso de refresh
    try {
      SetIsloading(true);
      const response = await axios.post(`${API_URL}/fillPdf`, reportState, {
        responseType: 'blob', // Esto está correcto para recibir un archivo binario.
      });
      const formattedDate = reportState.date
        .replace(/\//g, '_')
        .replace(/\s+/g, '_');
      const formattedName = reportState.full_name
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();

      const filename = `Report_card_${formattedName}_${formattedDate}.pdf`;
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      // Limpieza después de la descarga de la url
      window.URL.revokeObjectURL(url);
      link.parentNode.removeChild(link);
      SetIsloading(false);
    } catch (err) {
      SetIsloading(false);
      Swal.fire('Ooops', 'ERROR generating Report Card PDF', 'error');
      console.log(err);
    }
  };

  return (
    <>
      {isloading ? (
        <PlaneSpinner />
      ) : (
        <Container className='container-custom'>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xs={12} sm={12} lg={8} md={12}>
                <h2 className='mb-1'>Report Card Form</h2>
              </Col>
            </Row>
            <Row className='mt-2'>
              {/* Primera Fila */}
              <Col xs={12} sm={6} md={4} lg={4} className='mt-1'>
                <Form.Group className='mb-3'>
                  <Form.Control
                    type='text'
                    name='full_name'
                    required
                    placeholder='Full Name'
                    onChange={handleUserInput}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={4} lg={4} className='mt-1'>
                <Form.Group className='mb-3'>
                  <Form.Control
                    type='text'
                    name='date'
                    required
                    placeholder='Date'
                    onChange={handleUserInput}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={4} lg={4} className='mt-1'>
                <Form.Group className='mb-3'>
                  <Form.Control
                    type='text'
                    name='company'
                    required
                    placeholder='Airline'
                    onChange={handleUserInput}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              {/* Segunda Fila */}
              <Col xs={12} sm={6} md={4} lg={1}>
                <Form.Group className='mb-3'>
                  <Form.Control
                    type='text'
                    name='age'
                    maxLength='2'
                    required
                    placeholder='Age'
                    onChange={handleUserInput}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={4} lg={{ span: 4, offset: 3 }}>
                <Form.Group className='mb-3'>
                  <Form.Control
                    type='text'
                    name='controller'
                    required
                    placeholder='Controller'
                    onChange={handleUserInput}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={4} lg={4}>
                <Form.Group className='mb-3'>
                  <Form.Control
                    type='text'
                    name='flight_hours'
                    required
                    placeholder='Flight Hours'
                    onChange={handleUserInput}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              {/* Tercera Fila */}
              <Col xs={12} sm={6} md={4} lg={4}>
                <Form.Group className='mb-3'>
                  <Form.Control
                    type='text'
                    name='airport'
                    required
                    placeholder='Airport'
                    onChange={handleUserInput}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={4} lg={2}>
                <Form.Group className='mb-3'>
                  <Form.Control
                    type='text'
                    name='rtari'
                    required
                    placeholder='RTARI'
                    onChange={handleUserInput}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className='App-pdf-table'>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={{ span: 6, offset: 0 }}
                className='mt-4'
              >
                <Typography variant='h6' gutterBottom component='div'>
                  Evaluation Results:
                </Typography>
                <StyledTableContainer component={Paper}>
                  <Table aria-label='customized table'>
                    <TableBody>
                      {/* Fila 1 */}
                      <StyledTableRow>
                        <StyledTableCell component='th' scope='row'>
                         Standard Phraseology
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          <Col lg={8} md={10} xs={12}>
                            <Form.Control
                              size='sm'
                              type='text'
                              required
                              maxLength='2'
                              name='standard_phrase'
                              onChange={handleUserInput}
                              value={reportState.standard_phrase || ''}
                            />
                          </Col>
                        </StyledTableCell>
                        <StyledTableCell component='th' scope='row'>
                          Routine ATC communications
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          <Col lg={8} md={10} xs={12}>
                            <Form.Control
                              size='sm'
                              type='text'
                              maxLength='2'
                              required
                              name='standard_phrase'
                              onChange={handleUserInput}
                              value={reportState.standard_phrase || ''}
                            />
                          </Col>
                        </StyledTableCell>
                      </StyledTableRow>
                      {/* Fila 2 */}
                      <StyledTableRow>
                        <StyledTableCell component='th' scope='row' rowSpan={2}>
                          Message Structure
                        </StyledTableCell>
                        <StyledTableCell align='right' rowSpan={2}>
                          <Col lg={8} md={10} xs={12}>
                            <Form.Control
                              size='sm'
                              maxLength='2'
                              required
                              type='text'
                              name='message_structure'
                              onChange={handleUserInput}
                              value={reportState.message_structure || ''}
                            />
                          </Col>
                        </StyledTableCell>
                        <StyledTableCell component='th' scope='row'>
                         Structure
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          <Col lg={8} md={10} xs={12}>
                            <Form.Control
                              size='sm'
                              type='text'
                              maxLength='2'
                              required
                              name='structure'
                              onChange={handleUserInput}
                              value={reportState.message_structure || ''}
                            />
                          </Col>
                        </StyledTableCell>
                      </StyledTableRow>
                      {/* Fila 3 */}
                      <StyledTableRow>
                        <StyledTableCell component='th' scope='row'>
                         Vocabulary
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          <Col lg={8} md={10} xs={12}>
                            <Form.Group>
                              <Form.Control
                                as='select'
                                size='sm'
                                name='vocabulary'
                                required
                                onChange={handleUserInput}
                                value={reportState.vocabulary || ''}
                              >
                                                                <option value=''></option>{' '}

                                {getVocabularyOptions().map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </Form.Control>
                            </Form.Group>
                          </Col>
                        </StyledTableCell>
                      </StyledTableRow>
                      {/* Fila 2 */}
                      <StyledTableRow>
                        <StyledTableCell component='th' scope='row' rowSpan={3}>
                         Communications during failure
                        </StyledTableCell>
                        <StyledTableCell align='right' rowSpan={3}>
                          <Col lg={10} md={12} xs={12} className=' me-3 p-1'>
                            <Form.Control
                              size='sm'
                              type='text'
                              required
                              maxLength='2'
                              name='communications'
                              onChange={handleUserInput}
                              value={reportState.communications || ''}
                            />
                          </Col>
                        </StyledTableCell>
                        <StyledTableCell component='th' scope='row'>
                         Pronunciation
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          <Col lg={10} md={12} xs={12} className=' me-3 p-1'>
                            <Form.Group>
                              <Form.Control
                                as='select'
                                size='sm'
                                name='pronunciation'
                                required
                                onChange={handleUserInput}
                                value={reportState.pronunciation || ''}
                              >
                                                                <option value=''></option>{' '}

                                {getCommuniOptions().map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </Form.Control>
                            </Form.Group>
                          </Col>
                        </StyledTableCell>
                      </StyledTableRow>
                      {/* Fila 4 */}
                      <StyledTableRow>
                        <StyledTableCell component='th' scope='row'>
                         Comprehension
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          <Col lg={8} md={10} xs={12}>
                            <Form.Group>
                              <Form.Control
                                as='select'
                                size='sm'
                                name='comprehension'
                                required
                                onChange={handleUserInput}
                                value={reportState.comprehension || ''}
                              >
                                <option value=''></option>{' '}
                                {getCommuniOptions().map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </Form.Control>
                            </Form.Group>
                          </Col>
                        </StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell component='th' scope='row'>
                         Interaction
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          <Col lg={8} md={10} xs={12}>
                            <Form.Control
                              size='sm'
                              type='text'
                              maxLength='2'
                              required
                              name='interaction'
                              onChange={handleUserInput}
                              value={reportState.communications || ''}
                            />
                          </Col>
                        </StyledTableCell>
                      </StyledTableRow>
                      {/* Fila 5 */}
                      <StyledTableRow>
                        <StyledTableCell component='th' scope='row'>
                         Fluency of the Dialogue
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          <Col lg={8} md={10} xs={12}>
                            <Form.Control
                              size='sm'
                              type='text'
                              required
                              maxLength='2'
                              name='fluency_dialogue'
                              onChange={handleUserInput}
                              value={reportState.fluency_dialogue || ''}
                            />
                          </Col>
                        </StyledTableCell>
                        <StyledTableCell component='th' scope='row'>
                         Fluency
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          <Col lg={8} md={10} xs={12}>
                            <Form.Control
                              size='sm'
                              type='text'
                              maxLength='2'
                              required
                              name='fluency'
                              onChange={handleUserInput}
                              value={reportState.fluency_dialogue || ''}
                            />
                          </Col>
                        </StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow></StyledTableRow>
                    </TableBody>
                  </Table>
                </StyledTableContainer>
                <Col
                  xs={12}
                  sm={12}
                  md={{ span: 8, offset: 2 }}
                  lg={{ span: 10, offset: 1 }}
                  className='mt-1 mb-2'
                >
                  <StyledTableContainer component={Paper}>
                    <Table aria-label='simple table'>
                      <TableBody>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                           Standard Phraseology
                          </TableCell>
                          <TableCell align='right'>
                            <Col lg={3} md={6} xs={3}>
                              <Form.Control
                                size='sm'
                                maxLength='2'
                                type='text'
                                required
                                name='standard_phrase'
                                onChange={handleUserInput}
                                value={reportState.standard_phrase || ''}
                              />
                            </Col>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                           Plain English
                          </TableCell>
                          <TableCell align='right'>
                            <Col lg={3} md={6} xs={3}>
                              <Form.Control
                                size='sm'
                                maxLength='2'
                                type='text'
                                required
                                name='plain_english'
                                onChange={handleUserInput}
                                value={reportState.plain_english || ''}
                              />
                            </Col>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                           Aviation English Final Grade
                          </TableCell>
                          <TableCell align='right'>
                            <Col lg={3} md={6} xs={3}>
                              <Form.Control
                                size='sm'
                                type='text'
                                maxLength='2'
                                required
                                name='final_grade'
                                onChange={handleUserInput}
                                value={reportState.final_grade || ''}
                              />
                            </Col>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </StyledTableContainer>

                  <p className='mt-2 mb-1'>
                    {' '}
                    According to this evaluation a pilot with a final grade of C
                    or D is not recommended to fly into international airspaces.{' '}
                  </p>
                </Col>
              </Col>
              <Col xs={12} sm={12} md={12} lg={6} className='mt-4'>
                <Typography
                  variant='h6'
                  gutterBottom
                  component='div'
                  align='center'
                >
                  Performance and Recommendation{' '}
                </Typography>
                <TableContainer component={Paper}>
                  <Table aria-label='customized table' className='custom-table'>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell
                          align='center'
                          className='header-cell'
                        ></StyledTableCell>
                        <StyledTableCell align='center' className='header-cell'>
                          Diagnostic Grade
                        </StyledTableCell>
                        <StyledTableCell align='center' className='header-cell'>
                          Recommendation
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <StyledTableCell align='center'>
                          A
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          Very Good
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          Voluntary recurrent training
                        </StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell align='center'>
                         B+
                        </StyledTableCell>
                        <StyledTableCell align='center'>Good</StyledTableCell>
                        <StyledTableCell align='center'>
                          Recommended recurrent training
                        </StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell align='center'>
                         B
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          Minimum Operational, with major improvement
                          opportunities*
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          Highly recommended remedial training
                        </StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell align='center'>
                         C
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          Fail. Insufficient communication skills
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          Must take remedial training
                        </StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell align='center'>
                         D
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          Fail. Communication Unsuccessful
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          Must take remedial training and English classes
                        </StyledTableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <p className='mt-1'>
                  * Under stress, fatigue or during a night flight, the pilot
                  could not effectively handle communication situations when a
                  “complication or unexpected turn of events occur” (ICAO, Doc
                  9835 p. 4-6). It includes the phraseology function{' '}
                </p>
              </Col>
            </Row>
            <Row className='mt-4'>
              <Col xs={12} md={12} lg={12}>
                <Card className='my-3'>
                  <Card.Body>
                    <Card.Title>
                      {' '}
                     Observations
                      <Col
                        xs={{ span: 2, offset: 10 }}
                        md={{ span: 2, offset: 10 }}
                        lg={2}
                      >
                        <TfiHandPointDown className='mb-2' size={25} />
                        Enter
                      </Col>
                    </Card.Title>

                    <Form.Control
                      as='textarea'
                      rows='4'
                      name='observations'
                      value={reportState.observations}
                      onChange={handleUserInput}
                    />
                  </Card.Body>
                </Card>
                <Button
                  className='mb-2 mt-2 mx-auto d-block'
                  variant='outline-secondary'
                  type='submit'
                >
                  Generar Report Card
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      )}
    </>
  );
}
export default ReportCard;
