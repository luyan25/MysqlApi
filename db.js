const mysql = require('mysql');

const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"560560",
    database:"hospital_test"

})
connection.connect((err) => {
    if (err) {
      console.error('数据库连接错误: ' + err.stack);
      return;
    }
  
    console.log('数据库已连接');
  });

  module.exports=connection;