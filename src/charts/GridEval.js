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
      width: 90,
      editable: true,
    },
    {
      field: 'month',
      headerName: 'Mes',
      width: 100,
      editable: true,
    },
    {
      field: 'applicant_name',
      headerName: 'Name Applicant',
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
      width: 90,
      editable: true,
    },
    {
      field: 'Company_email',
      headerName: 'Company Email',
      width: 150,
      editable: true,
    },
    {
      field: 'flight_hours',
      headerName: 'Flight Hours',
      width: 150,
      editable: true,
    },
    {
      field: 'rtari_level',
      headerName: 'RTARI 4,5,6',
      width: 20,
      editable: true,
    },
    {
      field: 'first_exam',
      headerName: 'Date 1º Exam',
      width: 90,
      editable: true,
    },
    {
      field: 'time',
      headerName: 'Hour 24hs',
      width: 90,
      editable: true,
    },
    {
      field: 'exam_calif',
      headerName: 'Calificación',
      width: 20,
      editable: true,
    },
    {
      field: 'result',
      headerName: 'Resultado',
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

  const rows = consulEval.map((row) => ({
    id: row.id,
    no: row.no,
    applicant_name : row.applicant_name,
    month: row.month,
    applicant_area: row.applicant_area,
    test_type: row.test_type,
    no_ambassador: row.no_ambassador,
    name_ambassador: row.name_ambassador,
    position: row.position,
    base: row.base,
    company_email: row.company_email,
    flight_hours: row.flight_hours,
    rtari_level: row.rtari_level,
    first_exam: row.first_exam,
    time: row.time,
    exam_calif: row.exam_calif,
    result: row.result
  }));
  return (

    <>
      <div className='titulo pt-4 mb-3 text-break'>
        <h1>Evaluations Historic</h1>
      </div>

      <Box
        //cambiar background color del grid
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
            checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 20, 50, 100]} 

          />
        </ThemeProvider>
      </Box>
    </>
  );
}


export default GridEval;
