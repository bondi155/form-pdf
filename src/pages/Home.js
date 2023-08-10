import React, { useEffect, useState } from 'react';
import '../css/App.css';
import {
  Form,
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  FormControl,
  ListGroup,
} from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config/config';
import SpinnerComponent from '../components/Spinner';
import images from '../components/Imagenes.js';

function Home() {
  const [searchInput, SetSearchInput] = useState('');
  const [isloading, SetIsloading] = useState(false);
  const [driveState, SetDriveState] = useState([]);

  const handleSearchDrive = async () => {
    try {
      SetIsloading(true);
      const response = await axios.get(`${API_URL}/googleDrive`, {
        params: {
          searchInput,
        },
      });
      SetDriveState(response.data.list);
      SetIsloading(false);
    } catch (err) {
      SetIsloading(false);
      console.error(err);
    }
  };

  return (
    <Container className='container-custom'>
      <Row>
        <Col sm={12} lg={8} md={12}>
          <h1 className='mb-2'>Google Drive Directory  <img src={images.drive} alt='driveimg' /></h1>
         
        </Col>
        <Col className='mt-2' sm={12} lg={2} md={12}>
       
        </Col>

        <Col sm={12} lg={12} md={12}>
          <InputGroup className='mb-3 mt-4'>
            <FormControl
              type='text'
              placeholder='Google Drive Searcher'
              aria-label='Search by file name'
              aria-describedby='basic-addon2'
              name='searchInput'
              onChange={(e) => SetSearchInput(e.target.value)}
            />
            <Button
              variant='outline-secondary'
              size='sm'
              id='button-addon2'
              onClick={handleSearchDrive}
            >
              Search
            </Button>
          </InputGroup>
        </Col>
        <hr />

        {isloading ? (
          <SpinnerComponent />
        ) : (
          <Col sm={12} lg={12} md={12}>
            <ListGroup className='mt-3 mb-5' style={{ overflowY: 'auto', maxHeight: '500px' }}>
              {driveState.map((file, index) => (
                <ListGroup.Item key={index}>
                  <ListGroup.Item
                    key={index}
                    action
                    href={`https://drive.google.com/file/d/${file.id}/view`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {file.name}
                  </ListGroup.Item>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default Home;
