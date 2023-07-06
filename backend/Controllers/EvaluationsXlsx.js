const ExcelJS = require('exceljs');
const mysql = require('mysql2/promise');
const pool = mysql.createPool(process.env.DATABASE_URL);

async function readExcelFile(file) {
  const workbook = new ExcelJS.Workbook();
  const data = [];

  try {
    await workbook.xlsx.readFile(file.path);
    const worksheet = workbook.getWorksheet(1);

    for (let rowNumber = 4; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);

      const rowData = [
        row.getCell('A').value,
        row.getCell('B').value,
        row.getCell('C').value,
        row.getCell('D').value,
        row.getCell('E').value,
        row.getCell('F').value,
        row.getCell('G').value,
        row.getCell('H').value,
        row.getCell('I').value,
        row.getCell('J').value,
        row.getCell('K').value,
        row.getCell('L').value,
        row.getCell('M').value,
        row.getCell('N').value,
        row.getCell('O').value,
        row.getCell('P').value,
        row.getCell('Q').value ? row.getCell('Q').value.result : null,
      ];

      const ambassadorNos = rowData[6];
      const times = rowData[14];
      const examCalifs = rowData[15];
      // Comparar rowData con los datos en la base de datos (hacemos un select con el array que extraemos del excel con el where)
      const [rows] = await pool.query(
        'SELECT * FROM evaluation_data WHERE company_email IN (?) AND full_name IN (?) AND time IN (?) AND exam_calif IN (?)',
        [[rowData[10]],[rowData[6]], [rowData[14]], [rowData[15]]]
      );

      // Si hay un resultado, significa que hay una columna que coincide en no_ambassador, time y exam_calif
      if (rows.length > 0) {
        let isDuplicate = false;
        for (const dbRow of rows) {
          if (
            dbRow.time === rowData[14] &&
            dbRow.exam_calif === rowData[15] &&
            dbRow.no_ambassador === rowData[5]
          ) {
            isDuplicate = true;
            break;
          }
        }
        if (isDuplicate) {
          console.log(
            'Hubo un dato duplicado que coincide en no_ambassador, time y exam_calif'
          );
        } else {
          if (rowData.some((cell) => cell !== null)) {
            data.push(rowData);
          }
        }
      } else {
        if (rowData.some((cell) => cell !== null)) {
          data.push(rowData);
        }
      }
    }

    if (!data || data.length === 0) {
      console.log(
        'Problema al insertar valores , verificar si estan los campos del A al P y en el orden del archivo consolidad'
      );
    } else {
      console.log(
        file.originalname,
        'Datos recolectados del archivo Excel con éxito'
      );
    }

    return data;
  } catch (error) {
    console.error('Error al procesar el archivo Excel:', error);
    throw error;
  }
}

function executeQuery(res, fileName, data) {
  const evaluationQuery = `INSERT INTO evaluation_data (no, applicant_name, month, applicant_area, test_type, no_ambassador, full_name, company, position, base, company_email, flight_hours, rtari_level, first_exam, time, exam_calif, result ) VALUES ?`;

  pool.query(evaluationQuery, [data], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({
        code: 'DB_INSERT_ERR',
        message: 'There is a Error in INSERT Query or Database',
      });
    } else {
      console.log('procesado correctamente en base de datos ');
      return res.status(200).json({
        code: 'SUCCESS',
        message: `${fileName} and information updated in DB.`,
      });
    }
  });
}

async function EvaluationsXlsx(req, res) {
  const file = req.file;

  try {
    const data = await readExcelFile(file);
    executeQuery(res, file.originalname, data);
  } catch (error) {
    console.error('Error al procesar el archivo Excel:', error);
    res.status(500).json({
      code: 'NO_PROCCESS',
      error: 'Error to insert data. Check columns (A to P values)',
    });
  }
}

module.exports = {
  EvaluationsXlsx,
};
