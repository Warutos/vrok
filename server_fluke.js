const { Connection, Request } = require("tedious");
const express = require('express');
const app = express();
const dbconf = require("./dbconfig");
//const common = require('./apihub/Utility/common');
//const APIKEY = 'a739ecf8-5d6c-443a-9ab9-1e730582aaa3';
//const bodyParser = require('body-parser');
const config = {
    authentication: {
      options: {
        userName: dbconf.dbUser, 
        password: dbconf.dbPass 
      },
      type: "default"
    },
    server: dbconf.dbServer, 
    options: {
      database: dbconf.dbName, 
      encrypt: true
    }
  };
app.use(express.json());
app.post('/login',(req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    //let username = 'tthayawat@netizen.co.th';
    //let password = '1234';
    let errdata = {status:'error'};
    let data = [];
    const sql = `select top 1 
    e.employee_id,e.status,h.result,h.check_date,e.first_name,e.last_name,e.position,e.department_id,d.department_name,e.company_id,c.company_name,c.address
    from m_employee e
    left outer join m_company c on (e.company_id=c.company_id)
    left outer join m_department d on (e.department_id=d.department_id)
    left outer join t_atk_history h on (e.employee_id=h.employee_id)
    where e.user_name='${username}' and e.user_password='${password}'
    order by h.check_date desc`
    
    const connection = new Connection(config);
    connection.on("connect", err => {
        if (err) {
          console.error(err.message);
          data.push(errdata);
          res.json({data});
        } else {
            console.log("Reading rows from the Table...");
            // Read all rows from table
            const request = new Request(
                sql,
              (err, rowCount) => {
                if (err) {
                  console.error(err.message);
                  data.push(errdata);
                  res.json({data});
                } else {
                  console.log(`${rowCount} row(s) returned`);
                }
                connection.close();
              }
            );
            request.on("row", columns => {
                var rowObject ={};
                columns.forEach(column => {
                    //console.log("%s\t%s", column.metadata.colName, column.value);
                    rowObject[column.metadata.colName] = column.value;
                });
                data.push(rowObject)
                console.log(data);
                res.json({data});
            });
            connection.execSql(request);
            //connection.close();
        }
      });
      connection.connect();
});

//list histoy by company fluke
app.use(express.json());
app.get('/historycompany',(req,res) => {
    //res.send("GET History 111");
    let id = req.body.id;
    //let id ="ntz";

    let errdata = {status:'error'};
    let data = [];
    const sql = `select 
    h.check_date,e.employee_id,e.first_name,e.last_name,h.result
    from m_employee e
    left outer join m_company c on (e.company_id=c.company_id)
    left outer join t_atk_history h on (e.employee_id=h.employee_id)
    where e.company_id = '${id}' ORDER BY check_date DESC`
    
    const connection = new Connection(config);
    connection.on("connect", err => {
        if (err) {
          console.error(err.message);
          data.push(errdata);
          res.json({data});
        } else {
            console.log("Reading rows from the Table...");
            // Read all rows from table
            const request = new Request(
                sql,
              (err, rowCount) => {
                if (err) {
                  console.error(err.message);
                  data.push(errdata);
                  res.json({data});
                } else {
                  console.log(`${rowCount} row(s) returned`);
                  res.json({data});
                }
                connection.close();
              }
            );
            request.on("row", columns => {
                let rowObject ={};
                columns.forEach(column => {
                    //console.log("%s\t%s", column.metadata.colName, column.value);
                    rowObject[column.metadata.colName] = column.value;
                });
                data.push(rowObject);
                console.log(data);
            });
            connection.execSql(request);
            //connection.close();
        }
      });
      connection.connect();
});

//list histoy by user fluke
app.use(express.json());
app.get('/historyuser',(req,res) => {
    //res.send("GET History 111");
    let id = req.body.id;
    //let id ="ntz";

    let errdata = {status:'error'};
    let data = [];
    const sql = `select 
    h.check_date,h.result,h.brand_id,h.photo_path
    from m_employee e
    left outer join m_company c on (e.company_id=c.company_id)
    left outer join t_atk_history h on (e.employee_id=h.employee_id)
    where e.employee_id = '${id}' ORDER BY check_date DESC`
    
    const connection = new Connection(config);
    connection.on("connect", err => {
        if (err) {
          console.error(err.message);
          data.push(errdata);
          res.json({data});
        } else {
            console.log("Reading rows from the Table...");
            // Read all rows from table
            const request = new Request(
                sql,
              (err, rowCount) => {
                if (err) {
                  console.error(err.message);
                  data.push(errdata);
                  res.json({data});
                } else {
                  console.log(`${rowCount} row(s) returned`);
                  res.json({data});
                }
                connection.close();
              }
            );
            request.on("row", columns => {
                let rowObject ={};
                columns.forEach(column => {
                    //console.log("%s\t%s", column.metadata.colName, column.value);
                    rowObject[column.metadata.colName] = column.value;
                });
                data.push(rowObject);
                console.log(data);
            });
            connection.execSql(request);
            //connection.close();
        }
      });
      connection.connect();
});

//list employee(admin) fluke
app.use(express.json());
app.get('/admin',(req,res) => {
    //res.send("GET History 111");
    let id = req.body.id;
    //let id ="ntz";

    let errdata = {status:'error'};
    let data = [];
    const sql =  `	select 
    e.employee_id,e.first_name,e.last_name,h.check_date,h.result
    from m_employee e
    left outer join m_company c on (e.company_id=c.company_id)
    left outer join t_atk_history h on (e.employee_id=h.employee_id)
    where e.company_id = '${id}' ORDER BY check_date DESC`
    
    const connection = new Connection(config);
    connection.on("connect", err => {
        if (err) {
          console.error(err.message);
          data.push(errdata);
          res.json({data});
        } else {
            console.log("Reading rows from the Table...");
            // Read all rows from table
            const request = new Request(
                sql,
              (err, rowCount) => {
                if (err) {
                  console.error(err.message);
                  data.push(errdata);
                  res.json({data});
                } else {
                  console.log(`${rowCount} row(s) returned`);
                  res.json({data});
                }
                connection.close();
              }
            );
            request.on("row", columns => {
                let rowObject ={};
                columns.forEach(column => {
                    //console.log("%s\t%s", column.metadata.colName, column.value);
                    rowObject[column.metadata.colName] = column.value;
                });
                data.push(rowObject);
                console.log(data);
            });
            connection.execSql(request);
            //connection.close();
        }
      });
      connection.connect();
});

const port = process.env.PORT || 3131;
app.listen(port,() => console.log(`Listening on port ${port}.....`));


