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
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'no',
      headerName: 'No.',
      width: 150,
      editable: true,
    },
    {
      field: 'mes',
      headerName: 'Mes',
      width: 150,
      editable: true,
    },
    {
      field: 'no_embajador',
      headerName: 'No. Embajador',
      width: 150,
      editable: true,
    },
    {
      field: 'posicion',
      headerName: 'Posición',
      width: 150,
      editable: true,
    },
    {
      field: 'base',
      headerName: 'Base',
      width: 150,
      editable: true,
    },
    {
      field: 'correo',
      headerName: 'Correo',
      width: 150,
      editable: true,
    },
    {
      field: 'horas_vuelo',
      headerName: 'Horas de Vuelo',
      width: 150,
      editable: true,
    },
    {
      field: 'rtari',
      headerName: 'RTARI 4,5,6',
      width: 150,
      editable: true,
    },
    {
      field: 'fecha_primera_prueba',
      headerName: 'Fecha 1º Prueba',
      width: 150,
      editable: true,
    },
    {
      field: 'hora',
      headerName: 'Hora 24hs',
      width: 150,
      editable: true,
    },
    {
      field: 'calificacion',
      headerName: 'Calificación',
      width: 150,
      editable: true,
    },
    {
      field: 'resultado',
      headerName: 'Resultado',
      width: 150,
      editable: true,
    },
  ];

  try {
  } catch (error) {}

  useEffect(() => {
    try {
      const response = axios.get(`${API_URL}/getDataSheets`, {});
      setConsulEval(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const rows = consulEval.map((row) => ({
    id: row.id_cliente,
    no: row.no,
    mes: row.mes,
    no_embajador: row.no_embajador,
    posicion: row.posicion,
    base: row.base,
    correo: row.correo,
    horas_vuelo: row.horas_vuelo,
    rtari: row.rtari,
    fecha_primera_prueba: row.fecha_primera_prueba,
    hora: row.hora,
    calificacion: row.calificacion,
    resultado: row.resultado,
  }));

  return (
    <>
      <div className='titulo pt-4 mb-3 text-break'>
        <h1>Consulta</h1>
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
                  pageSize: 5,
                },
              },
            }}
            slots={{
              toolbar: GridToolbar,
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </ThemeProvider>
      </Box>
    </>
  );
}

//el props puedo usarlo para cuando pase el componente , le de otro valor , por ejemplo el de otro mapeo...

export default GridEval;
