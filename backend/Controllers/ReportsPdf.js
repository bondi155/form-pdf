const { PDFDocument } = require('pdf-lib');

const fs = require('fs').promises;

async function reportCardFill__(req, res) {
  const reportState = req.body;//hay que pasa el mismo nombre del parametro del front...
  console.log(req.body);
  console.log(reportState.full_name);

  try {
    // Asegúrate de que el path al PDF template es correcto
    const pdfPath = 'report_model.pdf';
    const formPdfBytes = await fs.readFile(pdfPath);
    const pdfDoc = await PDFDocument.load(formPdfBytes);

    const form = pdfDoc.getForm();
    
    const nameField = form.getTextField('full_name');
    const companyField = form.getTextField('company');
    const controllerField = form.getTextField('controller');
    const airportField = form.getTextField('airport');
    const dateField = form.getTextField('date');
    const ageField = form.getTextField('age');
    const flightHoursField = form.getTextField('flight_hours');
    const rtariField = form.getTextField('rtari');
    const communicationsField = form.getTextField('communications');
    const messageStrucField = form.getTextField('message_structure');
    const fluencyField = form.getTextField('fluency');
    const fluencyDialogueField = form.getTextField('fluency_dialogue');
    const pronunciationField = form.getTextField('pronunciation');
    const comprehensionField = form.getTextField('comprehension');
    const interactionField = form.getTextField('interaction');
    const structureField = form.getTextField('structure');
    const vocabularyField = form.getTextField('vocabulary');
    const plainEnglishField = form.getTextField('plain_english');
    const standardPrhaseField = form.getTextField('standard_phrase');
    const finalGradeField = form.getTextField('final_grade');
    const observationsField = form.getTextField('observations');

    // Asignando los valores obtenidos del frontend a los campos del formulario PDF
    nameField.setText(reportState.full_name); // Asumiendo que en reportState la propiedad se llama 'fullName'
    companyField.setText(reportState.company);
    controllerField.setText(reportState.controller);
    airportField.setText(reportState.airport);
    dateField.setText(reportState.date);
    ageField.setText(reportState.age);
    flightHoursField.setText(reportState.flight_hours);
    rtariField.setText(reportState.rtari);
    communicationsField.setText(reportState.communications);
    messageStrucField.setText(reportState.message_structure);
    fluencyField.setText(reportState.fluency);
    fluencyDialogueField.setText(reportState.fluency_dialogue);
    pronunciationField.setText(reportState.pronunciation);
    comprehensionField.setText(reportState.comprehension);
    interactionField.setText(reportState.interaction);
    structureField.setText(reportState.structure);
    vocabularyField.setText(reportState.vocabulary);
    plainEnglishField.setText(reportState.plain_english);
    standardPrhaseField.setText(reportState.standard_phrase);
    finalGradeField.setText(reportState.final_grade);
    observationsField.setText(reportState.observations);

    //formulario impreso y no editable 
    form.flatten();

    // Serializar el documento PDF a bytes
    const pdfBytes = await pdfDoc.save();

    // Envío del PDF como descarga
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
