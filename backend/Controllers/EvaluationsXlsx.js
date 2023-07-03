const ExcelJS = require('exceljs');
const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);

async function EvaluationsXlsx(req, res) {
  const file = req.file;
  const workbook = new ExcelJS.Workbook();

  try {
    await workbook.xlsx.readFile(file.path);

    const worksheet = workbook.getWorksheet(1);

    const data = [];

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
        // Aquí extraemos el valor de 'result' directamente
        row.getCell('P').value ? row.getCell('P').value.result : null,
      ];

      if (rowData.some(cell => cell !== null)) {
        data.push(rowData);
      }
        }

    // Realiza las operaciones deseadas con los datos del archivo Excel
    if (!data  || data.length === 0){
        console.log('Problema al insertar valores , verificar si estan los campos del A al P y en el orden del archivo consolidad');
    }else{
    console.log(req.file.originalname, 'Datos recolectados del archivo Excel con éxito');   
}
   // console.log(data);

    const evaluationQuery = `INSERT INTO evaluation_data (no, applicant_name, month, applicant_area, test_type, no_ambassador, name_ambassador, position, base, company_email, flight_hours, rtari_level, first_exam, time, exam_calif, result ) VALUES ?`;

    pool.query(evaluationQuery, [data], (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .send('Error al insertar los datos de excel en base de datos', err);
      }else{
        console.log('procesado correctamente en base de datos ');
        return res
        .status(200)
        .json({ code: 'SUCCESS', message: `${req.file.originalname} and information updated in DB.` });
      }
    });

  } catch (error) {
    console.error('Error al procesar el archivo Excel:', error);
    res
      .status(500)
      .json({ code: 'NO PROCCESS ', error: 'Error to insert data. Check columns (A to P values)' });
  }
}

module.exports = {
  EvaluationsXlsx,
};
