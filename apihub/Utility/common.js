const { Connection, Request } = require("tedious");
const dbconf = require("../../dbconfig");

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: dbconf.dbUser, // update me
      password: dbconf.dbPass // update me
    },
    type: "default"
  },
  server: dbconf.dbServer, // update me
  options: {
    database: dbconf.dbName, //update me
    encrypt: true
  }
};

exports.login = function (user,pass){
    let errdata = {status:'error'};
    let jsonArray = [];
    const sql = `select top 1 
    e.employee_id,e.status,h.result,h.check_date,e.first_name,e.last_name,e.position,e.department_id,d.department_name,e.company_id,c.company_name,c.address
    from m_employee e
    left outer join m_company c on (e.company_id=c.company_id)
    left outer join m_department d on (e.department_id=d.department_id)
    left outer join t_atk_history h on (e.employee_id=h.employee_id)
    where e.user_name='${user}' and e.user_password='${pass}'
    order by h.check_date desc`
    
    const connection = new Connection(config);
    connection.on("connect", err => {
        if (err) {
          console.error(err.message);
          connection.close();
          jsonArray.push(errdata);
        } else {
            console.log("Reading rows from the Table...");
            // Read all rows from table
            const request = new Request(
                sql,
              (err, rowCount) => {
                if (err) {
                  console.error(err.message);
                  connection.close();
                  jsonArray.push(errdata);
                } else {
                  console.log(`${rowCount} row(s) returned`);
                }
              }
            );
            request.on("row", columns => {
                var rowObject ={};
                columns.forEach(column => {
                    //console.log("%s\t%s", column.metadata.colName, column.value);
                    rowObject[column.metadata.colName] = column.value;
                });
                jsonArray.push(rowObject)
            });
            connection.execSql(request);
        }
      });
      connection.connect();
      connection.close();
      return jsonArray;
}


 exports.login2 = function (user,pass,callback){
    let errdata = {status:'error'};
    let jsonArray = [];
    const sql = `select top 1 
    e.employee_id,e.status,h.result,h.check_date,e.first_name,e.last_name,e.position,e.department_id,d.department_name,e.company_id,c.company_name,c.address
    from m_employee e
    left outer join m_company c on (e.company_id=c.company_id)
    left outer join m_department d on (e.department_id=d.department_id)
    left outer join t_atk_history h on (e.employee_id=h.employee_id)
    where e.user_name='${user}' and e.user_password='${pass}'
    order by h.check_date desc`
    
    const connection = new Connection(config);
    connection.on("connect", err => {
        if (err) {
          console.error(err.message);
          jsonArray.push(errdata);
          connection.close();
          return jsonArray;
        } else {
            console.log("Reading rows from the Table...");
            // Read all rows from table
            const request = new Request(
                sql,
              (err, rowCount) => {
                if (err) {
                  console.error(err.message);
                  jsonArray.push(errdata);
                  return jsonArray;
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
                jsonArray.push(rowObject)
                console.log(jsonArray);
                return jsonArray;
            });
            connection.execSql(request);
            //connection.close();
        }
      });
      connection.connect();
}