const { Connection, Request } = require("tedious");
const cors = require('cors');
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
app.use(cors());
app.post('/login',(req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    //let username = 'tthayawat@netizen.co.th';
   // let password = '1234';
    //let response = {status:'error'};
    //let data = [];
    let data ={};
    const sql = `select top 1 
    e.employee_id,e.status,h.result,h.check_date,e.first_name,e.last_name,e.position,e.department_id,d.department_name,e.company_id,c.company_name,c.address
    from m_employee e
    left outer join m_company c on (e.company_id=c.company_id)
    left outer join m_department d on (e.department_id=d.department_id)
    left outer join t_atk_history h on (e.employee_id=h.employee_id)
    where e.user_name='${username}' and e.user_password='${password}'
    order by h.check_date desc`;
    
    const connection = new Connection(config);
    connection.on("connect", err => {
        if (err) {
          console.error(err.message);
          data["responsestatus"] = "0";
          res.json({data});
        } else {
            console.log("Reading rows from the Table...");
            // Read all rows from table
            const request = new Request(
                sql,
              (err, rowCount) => {
                if (err) {
                  console.error(err.message);
                  data["responsestatus"] = "0";
                  res.json({data});
                } else {
                  console.log(`${rowCount} row(s) returned`);
                  if(rowCount == 0){
                    data["responsestatus"] = "0";
                  }
                  res.json({data});
                }
                connection.close();
              }
            );
            request.on("row", columns => {
                //var rowObject ={};
                columns.forEach(column => {
                    //console.log("%s\t%s", column.metadata.colName, column.value);
                    data[column.metadata.colName] = column.value;
                });
                data["responsestatus"] = "1";
                //data.push(rowObject)
                //console.log(data);
            });
            connection.execSql(request);
            //connection.close();
        }
      });
      connection.connect();
});
app.get('/history',(req,res) => {
    let sdata = {name:"Warut",nickname:"Oat"};
    let data = [];
    data.push(sdata);
    res.json({data});
});

app.get('/image/:name',(req,res,next) => {
    var options = {
        root: "./image",
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      };
    
      var fileName = req.params.name;
      res.sendFile(fileName, options, function (err) {
        if (err) {
            res.sendFile("error.png", options, function (err) {
                if (err) {
                  next(err);
                } else {
                  console.log('Sent:', "error.png")
                }
              });
        } else {
          console.log('Sent:', fileName)
        }
      });
});
const port = process.env.PORT || 3131;
app.listen(port,() => console.log(`Listening on port ${port}.....`));