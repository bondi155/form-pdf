const { PDFDocument } = require('pdf-lib');
const mysql = require('mysql2/promise');
const pool = mysql.createPool(process.env.DATABASE_URL);
const fs = require('fs').promises;

async function InsertIntoDB(
  titulo,
  desc_proyecto,
  nom_proyecto,
  municipio,
  cod_pdn_01,
  cod_proyecto_01,
  municipio_02,
  uap,
  nom_responsable,
  cod_acuerdo,
  desc_acuerdo,
  udf_01,
  cod_decreto_01,
  desc_ley,
  desc_capitulo,
  cod_proy_pdn,
  inf_anual_pag_01,
  inf_anual_pag_02,
  inf_anual_pag_03,
  s1_rev_01,
  desc_pruebas
) {
  try {
    const query = `
      INSERT INTO libros_blancos 
      (
        lb_titulo, 
        lb_desc_proyecto,
        lb_nom_proyecto, 
        lb_municipio, 
        lb_cod_pdn_01, 
        lb_cod_proyecto_01, 
        lb_municipio_02, 
        lb_uap, 
        lb_nom_responsable, 
        lb_cod_acuerdo, 
        lb_desc_acuerdo, 
        lb_udf_01, 
        lb_cod_decreto_01, 
        lb_desc_ley, 
        lb_desc_capitulo,
        lb_cod_proy_pdn, 
        lb_inf_anual_pag_01,
        lb_inf_anual_pag_02, 
        lb_inf_anual_pag_03, 
        lb_s1_rev_01, 
        lb_desc_pruebas
       ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Utilizamos pool.query para la inserción
    const [results] = await pool.query(query, [
      titulo,
      desc_proyecto,
      nom_proyecto,
      municipio,
      cod_pdn_01,
      cod_proyecto_01,
      municipio_02,
      uap,
      nom_responsable,
      cod_acuerdo,
      desc_acuerdo,
      udf_01,
      cod_decreto_01,
      desc_ley,
      desc_capitulo,
      cod_proy_pdn,
      inf_anual_pag_01,
      inf_anual_pag_02,
      inf_anual_pag_03,
      s1_rev_01,
      desc_pruebas,
    ]);

    console.log(
      'Reporte insertado en BD:',
      results.insertId,
      nom_proyecto,
      municipio
    );
    // No es necesario cerrar la conexión aquí, el pool gestiona eso automáticamente
  } catch (error) {
    console.error('Error al insertar en la base de datos:', error);
    throw error; // O maneja el error según necesites
  }
}
// Ejecutamos esta funcion dentro de reportCardFill asi ya tiene las variables y no nos rompemos la cabeza y mete las cosas en la base de datos

async function reportCardFill__(req, res) {
  const reportState = req.body.reportState; // Siempre hay que pasa el mismo nombre del parametro del front...
  console.log(req.body);
  console.log(reportState.proyecto);

  try {
    const pdfPath = 'form-lbymd.pdf';
    const formPdfBytes = await fs.readFile(pdfPath);
    const pdfDoc = await PDFDocument.load(formPdfBytes);

    const form = pdfDoc.getForm();

    const tituloField = form.getTextField('titulo');
    const proyectoField = form.getTextField('proyecto');
    const nProyField = form.getTextField('n_proy');
    const estadoField = form.getTextField('estado');
    const pdn01Field = form.getTextField('pdn_01');
    const codProy01Field = form.getTextField('cod_proy_01');
    const estMunField = form.getTextField('est_mun');
    const uapField = form.getTextField('uap');
    const nomRespField = form.getTextField('nom_resp');
    const acuerdoField = form.getTextField('acuerdo');
    const descAcuerField = form.getTextField('desc_acuer');
    const udf01Field = form.getTextField('udf_01');
    const numDecretoField = form.getTextField('num_decreto');
    const leyField = form.getTextField('ley');
    const descCapituloField = form.getTextField('desc_capitulo');
    const codProyPdnField = form.getTextField('cod_proy_pdn');
    const anPag01Field = form.getTextField('an_pag_01');
    const anPag02Field = form.getTextField('an_pag_02');
    const anPag03Field = form.getTextField('an_pag_03');
    const reRevField = form.getTextField('re_rev');
    const pruebasField = form.getTextField('pruebas');

    // Asignando los valores obtenidos del frontend a los campos del formulario PDF
    tituloField.setText(reportState.titulo);
    proyectoField.setText(reportState.proyecto);
    nProyField.setText(reportState.n_proy);
    estadoField.setText(reportState.estado);
    pdn01Field.setText(reportState.pdn_01);
    codProy01Field.setText(reportState.cod_proy_01);
    estMunField.setText(reportState.est_mun);
    uapField.setText(reportState.uap);
    nomRespField.setText(reportState.nom_resp);
    acuerdoField.setText(reportState.acuerdo);
    descAcuerField.setText(reportState.desc_acuer);
    udf01Field.setText(reportState.udf_01);
    numDecretoField.setText(reportState.num_decreto);
    leyField.setText(reportState.ley);
    descCapituloField.setText(reportState.desc_capitulo);
    codProyPdnField.setText(reportState.cod_proy_pdn);
    anPag01Field.setText(reportState.an_pag_01);
    anPag02Field.setText(reportState.an_pag_02);
    anPag03Field.setText(reportState.an_pag_03);
    reRevField.setText(reportState.re_rev);
    pruebasField.setText(reportState.pruebas);
    //formulario impreso y no editable
    form.flatten();

    //Serializar el documento PDF a bytes
    const pdfBytes = await pdfDoc.save();

    await InsertIntoDB(
      reportState.titulo,
      reportState.proyecto,
      reportState.n_proy,
      reportState.estado,
      reportState.pdn_01,
      reportState.cod_proy_01,
      reportState.est_mun,
      reportState.uap,
      reportState.nom_resp,
      reportState.acuerdo,
      reportState.desc_acuer,
      reportState.udf_01,
      reportState.num_decreto,
      reportState.ley,
      reportState.desc_capitulo,
      reportState.cod_proy_pdn,
      reportState.an_pag_01,
      reportState.an_pag_02,
      reportState.an_pag_03,
      reportState.re_rev,
      reportState.pruebas
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
