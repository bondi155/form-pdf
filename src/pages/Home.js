import React from 'react';
import '../css/App.css';
import {
  Container,
  Row,
  Col,
 
} from 'react-bootstrap';


function Home({ form }) {
  

  return (
    <Container className='container-custom'>
      <Row>
        <Col
          xs={{ span: 10, offset: 1 }}
          sm={{ span: 12, offset: 0 }}
          lg={{ span: 8, offset: 0 }}
          md={{ span: 12, offset: 0 }}
        >
          <h1 className='mb-2'>
           Home 
          </h1> 
        </Col>
      
    
      </Row>
    </Container>
  );
}

export default Home;
