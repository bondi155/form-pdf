const ExcelJS = require('exceljs');
const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);

async function readExcelFile(file) {
  const workbook = new ExcelJS.Workbook();
  const data = [];

  try {
    await workbook.xlsx.readFile(file.path);
    const worksheet = workbook.getWorksheet(1);

    // Iterar sobre las filas a partir de la fila 4
    for (let rowNumber = 4; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);

      // Obtener los valores de las columnas A a P
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
        // Aquí extraemos el valor de 'result' directamente agregamos tambien una columna para compañia , agregar eso al archivo consolidado.
        row.getCell('Q').value, //? row.getCell('Q').value.result : null,
        row.getCell('R').value,

      ];

      if (rowData.some(cell => cell !== null)) {
        data.push(rowData);
      }
    }

    if (!data  || data.length === 0){
      console.log(' There was a problem maping the cells from Excel file...Check the file and try Again');
    } else {
      console.log(file.originalname, 'Succes proccessing Uploaded Excel file ...Waiting for insert in DB...');   
    }

    return data;
  } catch (error) {
    console.error('There was a error processing the upload Excel file (evaluations)', error);
    throw error;
  }
}
function executeQuery(res, fileName, data) {
  const evaluationQuery = `
  INSERT INTO evaluation_data 
    (no, company, applicant_name, month, applicant_area, test_type, no_ambassador, full_name, position, base, company_email, flight_hours, rtari_level, first_exam, time, exam_calif, result, comments)
  VALUES ?
  ON DUPLICATE KEY UPDATE 
    comments=VALUES(comments);
`;

  pool.query(evaluationQuery, [data], (err, result) => {
    if (err) {
      console.error('Error in evaluationQuery query..Check DB connection', err);
      return res
        .status(500)
        .send({code: 'DB_INSERT_ERR', message: 'There is a Error in INSERT Query or Database'});
    } else {
      console.log('Succes inserting data from Excel evaluation file!');
      return res
      .status(200)
      .json({ code: 'SUCCESS', message: `${fileName} and information updated in DB.` });
    }
  });
}

async function EvaluationsXlsx(req, res) {
  const file = req.file;

  try {
    const data = await readExcelFile(file);
    executeQuery(res, file.originalname, data);
  } catch (error) {
    console.error('There was a error proccesing Excel file :', error);
    res
      .status(500)
      .json({ code: 'NO_PROCCESS', error: 'Error to insert data. Check columns (A to P values)' });
  }
}

module.exports = {
  EvaluationsXlsx,
};
