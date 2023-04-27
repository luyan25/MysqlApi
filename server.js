var express=require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const router = express.Router();
const connection=require('./db')
var app =express();
var bodyParser = require('body-parser'); 
app.use(cors());
//引用bodyParser 这个不要忘了写
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
 });

  // 登陆
  app.post('/api/login', (req, res) => {
    const { userName, password } = req.body;
    // 查询数据库中是否存在匹配的记录
    const sql = 'SELECT * FROM userlogin WHERE userName = ? AND password = ?';
    connection.query(sql, [userName, password], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
      } else {
        if (results.length === 0) {
          // 如果没有找到匹配的记录，则返回 401 错误
          res.status(401).json({ error: 'Invalid username or password' });
        } else {
          // 如果找到了匹配的记录，则使用 JWT 生成令牌并返回给客户端
          const token = jwt.sign({ userName }, 'mysecretkey');
          res.json({ token });
        }
      }
    });
  });

// get请求住院查询内容
app.get('/api/2', (req, res) => {
    connection.query('SELECT * FROM hospitalization', (error, results) => {
      if (error) {
        console.error('Error querying database: ' + error.stack);
        res.status(500).send('Server error');
        return;
      }
  
      res.status(200).json(results);
    });
  });
  //get请求出院病人列表
  app.get('/api/dischargelist', (req, res) => {
    connection.query('SELECT * FROM discharge_list', (error, results) => {
      if (error) {
        console.error('Error querying database: ' + error.stack);
        res.status(500).send('Server error');
        return;
      }
      res.status(200).json(results);
    });
  });

    //get请求医生列表
    app.get('/api/doctorlist', (req, res) => {
      connection.query('SELECT * FROM doctor_list', (error, results) => {
        if (error) {
          console.error('Error querying database: ' + error.stack);
          res.status(500).send('Server error');
          return;
        }
        res.status(200).json(results);
      });
    });
//get请求药品结算
    app.get('/api/fee', (req, res) => {
      connection.query('SELECT * FROM fee_list', (error, results) => {
        if (error) {
          console.error('Error querying database: ' + error.stack);
          res.status(500).send('Server error');
          return;
        }
        res.status(200).json(results);
      });
    });
  // 搜索住院
  app.get('/api/search', (req, res) => {
    const searchTerm = req.query.searchTerm;
    const phone = req.query.phone;
    const query = `SELECT * FROM hospitalization WHERE uname LIKE '%${searchTerm}%' AND phone LIKE '%${phone}%'`;
    connection.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
    // 搜索出院
    app.get('/api/searchdischarge', (req, res) => {
      const searchTerm = req.query.searchTerm;
      const query = `SELECT * FROM discharge_list WHERE idcard LIKE '%${searchTerm}%'`;
      connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
      });
    });

     // 搜索医生
     app.get('/api/searchdoctorlist', (req, res) => {
      const searchTerm = req.query.searchTerm;
      const query = `SELECT * FROM doctor_list WHERE idcard LIKE '%${searchTerm}%'`;
      connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
      });
    });

         // 搜索个人药品账单
         app.get('/api/searchpatientlist', (req, res) => {
          const searchTerm = req.query.searchTerm;
          const query = `SELECT * FROM fee_list WHERE uno LIKE '${searchTerm}'`;
          connection.query(query, (err, results) => {
            if (err) throw err;
            res.json(results);
          });
        });

          // 搜索个人药品账单
          app.get('/api/searchmedicinelist', (req, res) => {
            const searchTerm = req.query.searchTerm;
            const query = `SELECT * FROM medicinelist WHERE mname LIKE '%${searchTerm}%'`;
            connection.query(query, (err, results) => {
              if (err) throw err;
              res.json(results);
            });
          });
//   get请求药品库存
app.get('/api/medicine', (req, res) => {
    connection.query('SELECT * FROM medicinelist', (error, results) => {
      if (error) {
        console.error('Error querying database: ' + error.stack);
        res.status(500).send('Server error');
        return;
      }
  
      res.status(200).json(results);
    });
  });
// get请求用户权限面板
app.get('/api/userlist', (req, res) => {
  connection.query('SELECT * FROM userlogin', (error, results) => {
    if (error) {
      console.error('Error querying database: ' + error.stack);
      res.status(500).send('Server error');
      return;
    }

    res.status(200).json(results);
  });
});

// 删除药品
app.delete('/records/:mname', (req, res) => {
  // 删除指定 ID 的记录
  const mname = req.params.mname;
  connection.query('DELETE FROM medicinelist WHERE mname = ?', mname, (error, result) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  });
});

// 更新药品
app.put('/update', (req, res) => {
  // 更新指定 ID 的记录
  // const mname = req.params.mname;
  const mname=req.body.mname;
  const mamount=req.body.mamount;
  connection.query('UPDATE medicinelist SET mamount=? WHERE mname = ?', [mamount,mname], (err, results) => {
    if (err) throw err;
    console.log(`Updated ${results.affectedRows} rows`);
  });
});
//删除用户登陆权限
app.delete('/userlist/:userName', (req, res) => {
  // 删除指定 ID 的记录
  const userName = req.params.userName;
  connection.query('DELETE FROM userlogin WHERE userName = ?', userName, (error, result) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  });
});

// 删除住院病人信息
app.delete('/patientlist/:uno', (req, res) => {
  // 删除指定 ID 的记录
  const uno = req.params.uno;
  connection.query('DELETE FROM hospitalization WHERE uno = ?', uno, (error, result) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  });
});

//删除出院记录
app.delete('/discharges/:idcard', (req, res) => {
  // 删除指定 ID 的记录
  const idcard = req.params.idcard;
  connection.query('DELETE FROM discharge_list WHERE idcard = ?', idcard, (error, result) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  });
});

//删除药品结算
app.delete('/feedele/:uno', (req, res) => {
  // 删除指定 ID 的记录
  const uno = req.params.uno;
  connection.query('DELETE FROM fee_list WHERE uno = ?', uno, (error, result) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  });
});

//删除医生
app.delete('/doctorlist/:idcard', (req, res) => {
  // 删除指定 ID 的记录
  const idcard = req.params.idcard;
  connection.query('DELETE FROM doctor_list WHERE idcard = ?', idcard, (error, result) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  });
});
// 药品添加
app.post('/api/records', (req, res) => {
  const newRecord = {
    mnum: req.body.mnum,
    mname: req.body.mname,
    mamount: req.body.mamount,
    mprice: req.body.mprice
  };
  connection.query('INSERT INTO medicinelist SET ?', newRecord, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('未能将记录添加到数据库');
    } else {
      const newRecordWithId = { ...newRecord, id: result.insertId };
      res.status(201).send(newRecordWithId);
    }
  });
});
//注册功能
app.post('/api/registered', (req, res) => {
  const newRecord = {
    userName: req.body.userName,
    password: req.body.password,

  };
  connection.query('INSERT INTO userlogin SET ?', newRecord, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Failed to add record to database.');
    } else {
      const newRecordWithId = { ...newRecord, id: result.insertId };
      res.status(201).send(newRecordWithId);
    }
  });
});
// 入院登记添加
app.post('/api/admission', (req, res) => {
  const newRecord = {
    key: req.body.key,
    uno: req.body.uno,
    uname: req.body.uname,
    usex: req.body.usex,
    uage:req.body.uage,
    Department: req.body.Department,
    Wardnumber: req.body.Wardnumber,
    Bednumber: req.body.Bednumber,
    situation: req.body.situation,
    phone: req.body.phone,
    adoctor:req.body.adoctor
  };
  connection.query('INSERT INTO hospitalization SET ?', newRecord, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Failed to add record to database.');
    } else {
      const newRecordWithId = { ...newRecord, id: result.insertId };
      res.status(201).send(newRecordWithId);
    }
  });
});
// 结算中心药品添加
app.post('/api/feeadd', (req, res) => {
  const newRecord = {
    uno: req.body. uno,
    uname: req.body.uname,
    mno: req.body.mno,
    mnum: req.body. mnum,
    mname:req.body.mname,
    mprice: req.body.mprice
  };
  connection.query('INSERT INTO fee_list SET ?', newRecord, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Failed to add record to database.');
    } else {
      const newRecordWithId = { ...newRecord, id: result.insertId };
      res.status(201).send(newRecordWithId);
    }
  });
});

// 出院登记添加
app.post('/api/discharge', (req, res) => {
  const newRecord = {
    uname: req.body. uname,
    uage: req.body.uage,
    dsituation: req.body.dsituation,
    udata: req.body.udata,
    idcard: req.body.idcard,
    usex: req.body.usex,
  };
  connection.query('INSERT INTO discharge_list SET ?', newRecord, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Failed to add record to database.');
    } else {
      const newRecordWithId = { ...newRecord, id: result.insertId };
      res.status(201).send(newRecordWithId);
    }
  });
});

// 医生添加
app.post('/api/doctor', (req, res) => {
  const newRecord = {
    dname: req.body. dname,
    dage: req.body.dage,
    department: req.body.department,
    experience: req.body.experience,
    idcard: req.body.idcard,
    dsex: req.body.dsex,
    phone: req.body.phone,
  };
  connection.query('INSERT INTO doctor_list SET ?', newRecord, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Failed to add record to database.');
    } else {
      const newRecordWithId = { ...newRecord, id: result.insertId };
      res.status(201).send(newRecordWithId);
    }
  });
});


//配置服务端口
var server = app.listen(3000, function () {

    var host = server.address().address;

     var port = server.address().port;

        console.log('Example app listening at http://%s:%s', host, port);
    })
