import React from 'react';
import 'react-data-grid/lib/styles.css';
import Box from '@mui/material/Box';
import { esES as coreBgBG } from '@mui/material/locale';
import { DataGrid, esES } from '@mui/x-data-grid';
import { esES as pickersBgBG } from '@mui/x-date-pickers/locales';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GridToolbar } from '@mui/x-data-grid';
import { Button } from 'react-bootstrap';
import '../css/App.css';
import { BsFillTrashFill } from 'react-icons/bs';

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
//  <BsFillTrashFill size={30}   onClick={() => onDelete(params.row.id)} style={{ cursor: 'pointer' }} />

function GridEval({ rows, columnsVar, onDelete }) {
  const deleteButtonColumn = {
    field: 'delete',
    headerName: '',
    width: 50,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <BsFillTrashFill size={25} color="black" onClick={() => onDelete(params.row.id)} style={{ cursor: 'pointer' }} />
    ),
  };
  const columns = [...columnsVar, deleteButtonColumn];

  return (
    <>
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
            sx={{
              width: '100%',
              backgroundColor: 'white',
            }}
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            slots={{
              toolbar: GridToolbar,
            }}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </ThemeProvider>
      </Box>
    </>
  );
}

export default GridEval;
