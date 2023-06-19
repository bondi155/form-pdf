import React, { useRef } from 'react';
import { Container, Row, Col, Table, Card } from 'react-bootstrap';
import logo from '../components/img/logo.png';
import '../css/App.css';

function ReportCard() {
  const reportCardPfg = useRef();
  const values = ['OK', 'OK', 'OK', 'OK', 'B', 'A+'];

  return (
    <>
    <Container className="container-custom">
      <Row>
        <Col>
        <img
            src={logo}
            width='180'
            height='130'
            className='d-inline-block align-top'
            alt='Uleadair logo'
          />
           </Col>
           <Col  className='mt-5' > 
          <h4 className='text-center'>Report Card</h4>
          <p className='text-center'>With International flight experience</p>
        </Col>
        <Col></Col>
      </Row>

      <Row>
        <Col xs={12} sm={6} md={8} lg={{ span: 4, offset: 2 }} className='mt-5'>
          <p><strong>Name: </strong> Alejandro Ezequiel Redonte</p>
        </Col>
        <Col xs={12} sm={6} md={4} lg={{ span: 2 , offset: 1}} className=' mt-5'>
          <p><strong>Date:</strong> 12/10/23</p>
        </Col>
      </Row>

      <Row>
        <Col xs={12} sm={6} md={8} lg={{ span: 4, offset: 2 }}>
          <p>  <strong>Airline:</strong> Alejandro Ezequiel Redonte</p>
        </Col>
        <Col xs={12} sm={6} md={4} lg={{ span: 2 , offset: 1 }}>
          <p><strong>Age:</strong> 12/10/23</p>
        </Col>
      </Row>

      <Row>
        <Col xs={12} sm={6} md={8} lg={{ span: 4, offset: 2 }}>
          <p><strong>Controller:</strong> Alejandro Ezequiel Redonte</p>
        </Col>
        <Col xs={12} sm={6} md={4} lg={{ span: 2 , offset: 1 }}>
          <p><strong>Flight:</strong> 12/10/23</p>
        </Col>
      </Row>

      <Row>
        <Col xs={12} sm={6} md={8} lg={{ span: 4, offset: 2 }}>
          <p><strong>Airport:</strong> Alejandro Ezequiel Redonte</p>
        </Col>
        <Col xs={12} sm={6} md={4} lg={{ span: 2, offset: 1  }}>
          <p ><strong>RTARI:</strong> 12/10/23</p>
        </Col>
      </Row>

        <Row className='App-pdf-table '>
          <Col xs={12} sm={12} md={{span:8, offset:2}} lg={{span:8, offset:2}} xl= {{span: 4, offset: 1}}className='mt-4'>
            <h4> Evaluation Result</h4>
            <Card className='mt-4 mb-3' >
              <Card.Body>
                <Card.Title></Card.Title>
                <div className="d-flex align-items-center mb-2">
                  <div className="border me-2 p-1">{values[0]}</div>
                  <Card.Text>(Part II) Message Structure</Card.Text>
                </div>

                <div className="d-flex align-items-center mb-2">
                  <div className="border me-2 p-1">{values[1]}</div>
                  <Card.Text>(Part III) Communications during Failure</Card.Text>
                </div>

                <div className="d-flex align-items-center mb-2">
                  <div className="border me-2 p-1">{values[2]}</div>
                  <Card.Text>(Part IV) Fluency of the Dialogue</Card.Text>
                </div>

                <div className="d-flex align-items-center mb-2">
                  <div className="border me-2 p-1">{values[3]}</div>
                  <Card.Text>Plain English</Card.Text>
                </div>

                <div className="d-flex align-items-center mb-2">
                  <div className="border me-2 p-1">{values[4]}</div>
                  <Card.Text>(Part I) Standard Phraseology</Card.Text>
                </div>

                <div className="d-flex align-items-center mb-2">
                  <div className="border me-2 p-1">{values[5]}</div>
                  <Card.Text><strong> Aviation English Final Grade:</strong></Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={12} md={12} xl={6} xxl={{span: 6, offset:1}} lg={12} className='mt-4'>
            <h4 className='text-center'>Performance and Recommendation</h4>
            <Table responsive className='custom-table'>
              <thead>
                <tr>
                  <th className='header-cell'></th>
                  <th className='header-cell'>Diagnostic Grade</th>
                  <th className='header-cell'>Recommendation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>A</td>
                  <td>Excellent</td>
                  <td>
                    Remedial training voluntary
                  </td>
                </tr>
                <tr>
                  <td>B+</td>
                  <td>
                    Very good, with room for improvement
                  </td>
                  <td>
                    Remedial training recommended
                  </td>
                </tr>
                <tr>
                  <td >B</td>
                  <td>
                    Good, with major improvement opportunities*
                  </td>
                  <td >
                    Remedial training highly recommended
                  </td>
                </tr>
                <tr>
                  <td>C</td>
                  <td >
                    Basic communication skills
                  </td>
                  <td >
                    Must take remedial training
                  </td>
                </tr>
                <tr>
                  <td >D</td>
                  <td >
                    Communication Unsuccessful
                  </td>
                  <td >
                    Must take remedial training and English classes
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      <Row className='mt-5'>
        <h4>Observations:</h4>
        <Col xs={12} md={12} lg={12}>
          <Card className="my-3">
            <Card.Body>
              <Card.Title>Here...</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </>
  );
}
export default ReportCard;
