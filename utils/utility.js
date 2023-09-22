// utility.js (or add this to your existing database connection file)
const connection = require('../config/database'); // Replace with the actual path to your connection file

function queryAsync(sql, values) {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = { queryAsync };
//utility.js