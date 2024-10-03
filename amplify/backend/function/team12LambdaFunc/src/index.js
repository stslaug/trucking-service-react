const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.RDS_HOST, // The RDS endpoint
  user: process.env.RDS_USER, // RDS master username
  password: process.env.RDS_PASSWORD, // RDS master password
  database: process.env.RDS_DATABASE, // The database name
});

exports.handler = async (event) => {
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        reject(err);
      }
      connection.query('SELECT * FROM your_table', (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  });
};
