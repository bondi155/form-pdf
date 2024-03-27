const { PDFDocument } = require('pdf-lib');
const mysql = require('mysql2/promise');
const pool = mysql.createPool(process.env.DATABASE_URL);
const fs = require('fs').promises;

async function InsertIntoDB(
  companyEmail,
  fullName,
  company,
  controller,
  airport,
  date,
  age,
  flightHours,
  rtari,
  communications,
  messageStructure,
  fluencyDialogue,
  plainEnglish,
  standardPhrase,
  finalGrade,
  observations
) {
  try {
    const query = `
      INSERT INTO report_cards 
      (company_email, full_name, company, controller, airport, first_exam, age, flight_hours, rtari_level, communications, message_structure, fluency_dialogue, plain_english, standard_phrase, exam_calif, observations) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Utilizamos pool.query para la inserción
    const [results] = await pool.query(query, [
      companyEmail,
      fullName,
      company,
      controller,
      airport,
      date,
      age,
      flightHours,
      rtari,
      communications,
      messageStructure,
      fluencyDialogue,
      plainEnglish,
      standardPhrase,
      finalGrade,
      observations,
    ]);

    console.log('Reporte insertado en BD:', results.insertId, results.fullName, results.companyEmail);
    // No es necesario cerrar la conexión aquí, el pool gestiona eso automáticamente
  } catch (error) {
    console.error('Error al insertar en la base de datos:', error);
    throw error; // O maneja el error según necesites
  }
}
// Ejecutamos esta funcion dentro de reportCardFill asi ya tiene las variables y no nos rompemos la cabeza y mete las cosas en la base de datos

async function reportCardFill__(req, res) {
  const reportState = req.body; //hay que pasa el mismo nombre del parametro del front...
  //console.log(req.body);
  //console.log(reportState.full_name);

  try {
    const pdfPath = 'formato_report_2024.pdf';
    const formPdfBytes = await fs.readFile(pdfPath);
    const pdfDoc = await PDFDocument.load(formPdfBytes);

    const form = pdfDoc.getForm();

    const nameField = form.getTextField('full_name');
    //const companyEmail = form.getTextField('company_email'); // Agregado el email company
    const companyField = form.getTextField('company');
    const controllerField = form.getTextField('controller');
    const airportField = form.getTextField('airport');
    const dateField = form.getTextField('date');
    const ageField = form.getTextField('age');
    const flightHoursField = form.getTextField('flight_hours');
    const rtariField = form.getTextField('rtari');
    //const rutineField = form.getTextField('rutine_comm');
    const communicationsField = form.getTextField('communications');
    const messageStrucField = form.getTextField('message_structure');
    //const fluencyField = form.getTextField('fluency');
    const fluencyDialogueField = form.getTextField('fluency_dialogue');
    //const pronunciationField = form.getTextField('pronunciation');
    //const comprehensionField = form.getTextField('comprehension');
    //const interactionField = form.getTextField('interaction');
    //const structureField = form.getTextField('structure');
    //const vocabularyField = form.getTextField('vocabulary');
    const plainEnglishField = form.getTextField('plain_english');
    const standardPrhaseField = form.getTextField('standard_phrase');
    const finalGradeField = form.getTextField('final_grade');
    const observationsField = form.getTextField('observations');

    // Asignando los valores obtenidos del frontend a los campos del formulario PDF
    nameField.setText(reportState.full_name);
    //companyEmail.setText(reportState.company_email); // Agregado correo  electronico de la empresa
    companyField.setText(reportState.company);
    controllerField.setText(reportState.controller);
    airportField.setText(reportState.airport);
    dateField.setText(reportState.date);
    ageField.setText(reportState.age);
    flightHoursField.setText(reportState.flight_hours);
    rtariField.setText(reportState.rtari);
    communicationsField.setText(reportState.communications);
    messageStrucField.setText(reportState.message_structure);
    //fluencyField.setText(reportState.fluency);
    fluencyDialogueField.setText(reportState.fluency_dialogue);
    //pronunciationField.setText(reportState.pronunciation);
    //comprehensionField.setText(reportState.comprehension);
    //interactionField.setText(reportState.interaction);
    //structureField.setText(reportState.structure);
    //vocabularyField.setText(reportState.vocabulary);
    plainEnglishField.setText(reportState.plain_english);
    standardPrhaseField.setText(reportState.standard_phrase);
    // rutineField.setText(reportState.rutine_comm);
    finalGradeField.setText(reportState.final_grade);
    observationsField.setText(reportState.observations);

    //formulario impreso y no editable
    form.flatten();

    //Serializar el documento PDF a bytes
    const pdfBytes = await pdfDoc.save();

    await InsertIntoDB(
      reportState.company_email,
      reportState.full_name,
      reportState.company,
      reportState.controller,
      reportState.airport,
      reportState.date,
      reportState.age,
      reportState.flight_hours,
      reportState.rtari,
      reportState.communications,
      reportState.message_structure,
      reportState.fluency_dialogue,
      reportState.plain_english,
      reportState.standard_phrase,
      reportState.final_grade,
      reportState.observations
    );

    //Envío del PDF como descarga
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=filled_form.pdf'
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytes));

    
  } catch (error) {
    console.error(error);
    res.status(500).send('Ocurrió un error al generar el PDF');
  }
}

module.exports = {
  reportCardFill__,
};
