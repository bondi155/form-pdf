const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);
const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configurar la autenticación con tu clave API
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_CORREO;

// Instanciar el API para enviar correos electrónicos

const apiInstance = new SibApiV3Sdk.SMTPApi();

async function queryforEmail(mes, anio) {
  console.log(anio, mes);
  try {
    const queryForEmail = `SELECT company_email, full_name, exam_calif, time ,first_exam, applicant_area, month FROM evaluation_data WHERE month = ? AND first_exam LIKE ? AND company = 'Volaris'`;
    const [result] = await pool.promise().query(queryForEmail, [mes, anio]);
    return result;
  } catch (err) {
    console.error(
      'Error in query for the email Sender...Check DB connection',
      err
    );
    throw err; // Propagar el error
  }
}

//queryforEmail();
// Ejemplo de función para enviar un correo electrónico transaccional
function enviarCorreoTransaccional(result) {
  result.forEach((persona) => {
    if (persona.applicant_area === 'Tripulación') {
      const emailData = {
        sender: {
          name: 'Uleadair: Tu calificación',
          email: 'uleadair_noreply@calification.com',
        },
        to: [
          {
            email: persona.company_email,
            name: persona.full_name,
          },
        ],
        subject: 'Calificación de Evaluación Uleadair',
        htmlContent: `
      <html>
          <head>
              <style>
                  body { font-family: Arial, sans-serif; }
                  .container { width: 100%; padding: 20px; }
                  .header { background-color: #f2f2f2; padding: 10px; text-align: center; }
                  .content { background-color: #fff; padding: 20px; }
                  .footer { background-color: #f2f2f2; padding: 10px; text-align: center; }
                  .passed { color: green; }
                  .failed { color: red; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                  <img src="https://iili.io/JRM2xbs.png" alt="Logotipo" border="0" />
                      <h2>Resultados de Evaluación</h2>
                  </div>
                  <div class="content">
                      <p>Estimado P. A ${persona.full_name},</p>
                      <p>Le informamos que en su evaluación de Radiocomunicaciones Aeronáuticas en Inglés realizada el <strong>${
                        persona.first_exam
                      } a las ${persona.time}</strong></p>
                      ${
                        ['A', 'B+', 'B'].includes(persona.exam_calif)
                          ? '<p class="passed">Usted obtuvo una calificación Aprobatoria.</p>'
                          : '<p class="failed">Usted obtuvo una calificación Reprobatoria.</p>'
                      }
                  </div>
                  <div class="footer">
                      <p>Agradecemos su participación y le deseamos un buen día. Si está interesado en cursos de inglés aeronáutico o radiocomunicaciones puede comunicarse por teléfono o whatsapp al 55 5068 3408 con la Lic. Alicia Pérez para obtener información.</p>
                  </div>
              </div>
          </body>
      </html>`,
      };

      apiInstance.sendTransacEmail(emailData).then(
        function () {
          console.log(`Correos enviados exitosamente para Tripulación ${persona.company_email} del mes de ${persona.month}`);
        },
        function (error) {
          console.error(
            'Error al enviar correo a ' + persona.company_email + ': ' + error
          );
        }
      );
    } else {
      console.log('No se envía correo a ' + persona.company_email + ' debido a que el área no es Tripulación.');
    }
  });
}

async function EmailFunctions(mes, anio) {
  try {
    const result = await queryforEmail(mes, anio);
    enviarCorreoTransaccional(result);
  } catch (err) {
    console.log(err);
  }
}
//EmailFunctions();
//enviarCorreoTransaccional();

module.exports = {
  EmailFunctions,
};
