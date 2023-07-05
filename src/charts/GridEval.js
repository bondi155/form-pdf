import React, { useEffect, useState } from 'react';
import 'react-data-grid/lib/styles.css';
import axios from 'axios';
import Box from '@mui/material/Box';
import { esES as coreBgBG } from '@mui/material/locale';
import { DataGrid, esES } from '@mui/x-data-grid';
import { esES as pickersBgBG } from '@mui/x-date-pickers/locales';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GridToolbar } from '@mui/x-data-grid';
import { API_URL } from '../config/config.js';
import '../css/App.css';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#000000' },
    },
  },
  esES, // x-data-grid translations
  pickersBgBG, // x-date-pickers translations
  coreBgBG // core translations
);

function GridEval() {
  const [consulEval, setConsulEval] = useState([]);
  const columns = [
    
    { field: 'id', headerName: 'ID', width: 50 },

    {
      field: 'no',
      headerName: 'No.',
      width: 70,
      editable: true,
    },
    {
      field: 'applicant_name',
      headerName: 'Name Applicant',
      width: 150,
      editable: true,
    },
    {
      field: 'month',
      headerName: 'Month',
      width: 100,
      editable: true,
    },
    {
      field: 'applicant_area',
      headerName: 'Name Area',
      width: 120,
      editable: true,
    },
    {
      field: 'test_type',
      headerName: 'Experience',
      width: 100,
      editable: true,
    },
    {
      field: 'no_ambassador',
      headerName: 'No Ambassador',
      width: 90,
      editable: true,
    },
    {
      field: 'full_name',
      headerName: 'Name Ambassador',
      width: 150,
      editable: true,
    },
    {
      field: 'company',
      headerName: 'Company',
      width: 150,
      editable: true,
    },
    {
      field: 'position',
      headerName: 'Position',
      width: 90,
      editable: true,
    },
    {
      field: 'base',
      headerName: 'Base',
      width: 70,
      editable: true,
    },
    {
      field: 'company_email',
      headerName: 'Company Email',
      width: 150,
      editable: true,
    },
    {
      field: 'flight_hours',
      headerName: 'Flight Hours',
      width: 90,
      editable: true,
    },
    {
      field: 'rtari_level',
      headerName: 'RTARI 4,5,6',
      width: 120,
      editable: true,
    },
    {
      field: 'first_exam',
      headerName: '1º Exam.',
      width: 110,
      editable: true,
    },
    {
      field: 'time',
      headerName: 'Hour',
      width: 110,
      editable: true,
    },
    {
      field: 'exam_calif',
      headerName: 'Calification',
      width: 50,
      editable: true,
    },
    {
      field: 'result',
      headerName: 'Result',
      width: 90,
      editable: true,
    },
  ];

  try {
  } catch (error) {}

  useEffect(() => {
    (async () => {
    try {
      const response = await axios.get(`${API_URL}/getDataEvaluations`, {});
      setConsulEval(response.data);
    } catch (error) {
      console.log(error);
    }
  })();
  }, []);


  const rows = consulEval.map((row, index) => ({
    id: index,
    ...row,
  }));


  return (

    <>
      <div className='mt-5 mb-3 titulo-grid'>
        <h1>Evaluations Historic</h1>
      </div>

      <Box
        sx={{
          flexGrow: 1,
          height: 600,
          width: '100%',
          mt: 5,
          pb: 5,
          alignGrids: 'center',
          px: 5,
        }}
      >
        <ThemeProvider theme={theme}>
          <DataGrid
            sx={{ backgroundColor: 'white' }}
           rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize:20 ,
                },
              },
            }}
            slots={{
              toolbar: GridToolbar,
            }}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 20, 50, 100]} 

          />
        </ThemeProvider>
      </Box>
    </>
  );
}


export default GridEval;
