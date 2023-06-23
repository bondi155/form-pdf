const db = require('../Config/dbConfig');


function consultaData__ (req, res) {

    const email = req.query.email ?? '';
  
    const sqlGetPerData = "SELECT * FROM aviation_data where email = ?";

    db.query(sqlGetPerData, email, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error al obtener datos personales");
        }
        
        if (result.length === 0) {
          return res.send("No se encontraron datos personales para el correo electrónico proporcionado");
        }
        
        res.send(result);
      });
   
  }


module.exports = {

    consultaData__
}