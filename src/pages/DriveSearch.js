import React, {
    useState } from 'react';
    import '../css/App.css';
    import {
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
    //import SpinnerComponent from '../components/Spinner';
    import images from '../components/Imagenes.js';
    import PlaneSpinner from '../components/planeSpinner';
    
function DriveSearch () {

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
          <Col
            xs={{ span: 12, offset: 0 }}
            sm={{ span: 12, offset: 0 }}
            lg={{ span: 8, offset: 0 }}
            md={{ span: 12, offset: 0 }}
          >
            <h1 className='mb-2'>
              Google Drive Browser <img className="drive-img" src={images.drive} alt='driveimg' />
            </h1>
          </Col>  
          <Col xs={12} sm={12} lg={12} md={12}>
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
            <PlaneSpinner />
          ) : (
            <Col sm={12} lg={12} md={12}>
              <ListGroup
                className='mt-3 mb-5'
                style={{ overflowY: 'auto', maxHeight: '500px' }}
              >
                {driveState.map((file, index) => (
                  <ListGroup.Item key={index}>
                    <ListGroup.Item
                      key={index}
                      action
                      href={`https://drive.google.com/file/d/${file.id}`}
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


export default DriveSearch;