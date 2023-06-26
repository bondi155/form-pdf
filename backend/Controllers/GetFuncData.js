//const db = require('../Config/dbConfig'); local para pruebas
const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);

function consultaData__ (req, res) {

    const email = req.query.email ?? '';
  
    const sqlGetPerData = "SELECT * FROM personal_data where personal_email = ?";

    pool.query(sqlGetPerData, email, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error to get personal data");
        }
        
        if (result.length === 0) {
          return res.send("This email is no exist in your Sheets");
        }
        
        res.send(result);
        console.log(result);
      });
   
  }


module.exports = {

    consultaData__
}