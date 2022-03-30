const { Connection, Request } = require("tedious");
const cors = require("cors");
const express = require("express");
const app = express();
const dbconf = require("./dbconfig");
//const common = require('./apihub/Utility/common');
//const APIKEY = 'a739ecf8-5d6c-443a-9ab9-1e730582aaa3';
//const bodyParser = require('body-parser');

const readFileSync = require("fs");
const bodyparser = require("body-parser");
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ type: "*/*" }));
app.use(express.json());

const util = require("util");
const fs = require("fs");
const PredictionApi = require("@azure/cognitiveservices-customvision-prediction");
const msRest = require("@azure/ms-rest-js");
var reuse = require("./reuse");

const config = {
  authentication: {
    options: {
      userName: dbconf.dbUser,
      password: dbconf.dbPass,
    },
    type: "default",
  },
  server: dbconf.dbServer,
  options: {
    database: dbconf.dbName,
    encrypt: true,
  },
};
app.use(express.json());
app.use(cors());
app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  //let username = 'tthayawat@netizen.co.th';
  // let password = '1234';
  //let response = {status:'error'};
  //let data = [];
  let data = {};
  const sql = `select top 1 
    e.employee_id,e.status,h.result,h.check_date,e.first_name,e.last_name,e.position,e.department_id,d.department_name,e.company_id,c.company_name,c.address
    from m_employee e
    left outer join m_company c on (e.company_id=c.company_id)
    left outer join m_department d on (e.department_id=d.department_id)
    left outer join t_atk_history h on (e.employee_id=h.employee_id)
    where e.user_name='${username}' and e.user_password='${password}'
    order by h.check_date desc`;

  const connection = new Connection(config);
  connection.on("connect", (err) => {
    if (err) {
      console.error(err.message);
      data["responsestatus"] = "0";
      res.json({ data });
    } else {
      console.log("Reading rows from the Table...");
      // Read all rows from table
      const request = new Request(sql, (err, rowCount) => {
        if (err) {
          console.error(err.message);
          data["responsestatus"] = "0";
          res.json({ data });
        } else {
          console.log(`${rowCount} row(s) returned`);
          if (rowCount == 0) {
            data["responsestatus"] = "0";
          }
          res.json({ data });
        }
        connection.close();
      });
      request.on("row", (columns) => {
        //var rowObject ={};
        columns.forEach((column) => {
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
app.get("/history", (req, res) => {
  let sdata = { name: "Warut", nickname: "Oat" };
  let data = [];
  data.push(sdata);
  res.json({ data });
});

app.get("/image/:name", (req, res, next) => {
  var options = {
    root: "./image",
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  var fileName = req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      res.sendFile("error.png", options, function (err) {
        if (err) {
          next(err);
        } else {
          console.log("Sent:", "error.png");
        }
      });
    } else {
      console.log("Sent:", fileName);
    }
  });
});

//list histoy by company fluke
app.use(express.json());
app.get("/historycompany", (req, res) => {
  //res.send("GET History 111");
  let id = req.body.id;
  //let id ="ntz";

  let errdata = { status: "error" };
  let data = [];
  const sql = `select 
    h.check_date,e.employee_id,e.first_name,e.last_name,h.result
    from m_employee e
    left outer join m_company c on (e.company_id=c.company_id)
    left outer join t_atk_history h on (e.employee_id=h.employee_id)
    where e.company_id = '${id}' ORDER BY check_date DESC`;

  const connection = new Connection(config);
  connection.on("connect", (err) => {
    if (err) {
      console.error(err.message);
      data.push(errdata);
      res.json({ data });
    } else {
      console.log("Reading rows from the Table...");
      // Read all rows from table
      const request = new Request(sql, (err, rowCount) => {
        if (err) {
          console.error(err.message);
          data.push(errdata);
          res.json({ data });
        } else {
          console.log(`${rowCount} row(s) returned`);
          res.json({ data });
        }
        connection.close();
      });
      request.on("row", (columns) => {
        let rowObject = {};
        columns.forEach((column) => {
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
app.get("/historyuser", (req, res) => {
  //res.send("GET History 111");
  let id = req.body.id;
  //let id ="ntz";

  let errdata = { status: "error" };
  let data = [];
  const sql = `select 
    h.check_date,h.result,h.brand_id,h.photo_name
    from m_employee e
    left outer join m_company c on (e.company_id=c.company_id)
    left outer join t_atk_history h on (e.employee_id=h.employee_id)
    where e.employee_id = '${id}' ORDER BY check_date DESC`;

  const connection = new Connection(config);
  connection.on("connect", (err) => {
    if (err) {
      console.error(err.message);
      data.push(errdata);
      res.json({ data });
    } else {
      console.log("Reading rows from the Table...");
      // Read all rows from table
      const request = new Request(sql, (err, rowCount) => {
        if (err) {
          console.error(err.message);
          data.push(errdata);
          res.json({ data });
        } else {
          console.log(`${rowCount} row(s) returned`);
          res.json({ data });
        }
        connection.close();
      });
      request.on("row", (columns) => {
        let rowObject = {};
        columns.forEach((column) => {
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
app.get("/admin", (req, res) => {
  //res.send("GET History 111");
  let id = req.body.id;
  //let id ="ntz";

  let errdata = { status: "error" };
  let data = [];
  const sql = `select 
    e.employee_id,e.first_name,e.last_name,h.check_date,h.result
    from m_employee e
    left outer join m_company c on (e.company_id=c.company_id)
    left outer join t_atk_history h on (e.employee_id=h.employee_id)
    where e.company_id = '${id}' ORDER BY check_date DESC`;

  const connection = new Connection(config);
  connection.on("connect", (err) => {
    if (err) {
      console.error(err.message);
      data.push(errdata);
      res.json({ data });
    } else {
      console.log("Reading rows from the Table...");
      // Read all rows from table
      const request = new Request(sql, (err, rowCount) => {
        if (err) {
          console.error(err.message);
          data.push(errdata);
          res.json({ data });
        } else {
          console.log(`${rowCount} row(s) returned`);
          res.json({ data });
        }
        connection.close();
      });
      request.on("row", (columns) => {
        let rowObject = {};
        columns.forEach((column) => {
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

app.post("/resultatk", (req, res) => {
  var data = {};
  var photo = req.body.photo;

  const Jimp = require("jimp");
  const fs = require("fs");

  const buffer = Buffer.from(photo, "base64");
  Jimp.read(buffer, (err, res) => {
    if (err) throw new Error(err);
    var file = res
      .quality(5)
      .write("./PictureATKTemp/" + reuse.dateformat + reuse.datetext + ".png");
  });

  const predictionKey = "d22d4e8a21814a4cb44cba126ebba65a";
  const predictionResourceId =
    "/subscriptions/53952dfb-8218-4d31-8adf-60d350a31c4c/resourceGroups/CustomVisionWebcasts/providers/Microsoft.CognitiveServices/accounts/CustomVisionVROK-Prediction";
  const predictionEndpoint =
    "https://customvisionvrok-prediction.cognitiveservices.azure.com/";

  // Authenticate the client
  const predictor_credentials = new msRest.ApiKeyCredentials({
    inHeader: { "Prediction-key": predictionKey },
  });
  const predictor = new PredictionApi.PredictionAPIClient(
    predictor_credentials,
    predictionEndpoint
  );

  const publishIterationName = "Iteration4";
  const setTimeoutPromise = util.promisify(setTimeout);

  //const inputFile = fs.readFileSync(`./PictureATK/images.jpg`);
  const buffer_ml = buffer;

  async function machineLearningResult() {
    try {
      const results = await predictor.detectImage(
        "82841321-2493-42c9-a7f4-55bd255771fc",
        publishIterationName,
        buffer_ml
      );
      console.log("------------------ Pass ------------------");
      results.predictions.forEach((predictedResult) => {
        console.log(
          `\t ${predictedResult.tagName}: ${(
            predictedResult.probability * 100.0
          ).toFixed(2)}%`
        );
      });

      var api_status = results.predictions.length > 0 ? "S" : "F";
      let arrayPredictions = results.predictions;
      var positive = 0;
      var negative = 0;

      for (var n = 0; n < arrayPredictions.length; n++) {
        if (arrayPredictions[n].tagName == "ATK_Negative") {
          if (arrayPredictions[n].probability * 100.0 > negative) {
            negative = arrayPredictions[n].probability * 100.0;
          }
        } else {
          if (arrayPredictions[n].probability * 100.0 > positive) {
            positive = arrayPredictions[n].probability * 100.0;
          }
        }
      }

      if (negative > 0 && positive > 0) {
        if (negative > positive) {
          var result = negative - positive;
          if (result > 40) {
            var resultATK = 1; //Negative
            res.json({ api_status, resultATK });
            Jimp.read(buffer, (err, res) => {
              if (err) throw new Error(err);
              var file = res
                .quality(5)
                .write(
                  "./PictureATK/" + reuse.dateformat + reuse.datetext + ".png"
                );
            });
          } else {
            api_status = "F"; // Fail
            res.json({ api_status });
          }
        } else {
          var result = positive - negative;
          if (result > 40) {
            var resultATK = 2; //Positive
            res.json({ api_status, resultATK });
            Jimp.read(buffer, (err, res) => {
              if (err) throw new Error(err);
              var file = res
                .quality(5)
                .write(
                  "./PictureATK/" + reuse.dateformat + reuse.datetext + ".png"
                );
            });
          } else {
            api_status = "F"; // Fail
            res.json({ api_status });
          }
        }
      } else if (negative > 0) {
        if (negative > 80) {
          var resultATK = 1; //Negative
          res.json({ api_status, resultATK });
          Jimp.read(buffer, (err, res) => {
            if (err) throw new Error(err);
            var file = res
              .quality(5)
              .write(
                "./PictureATK/" + reuse.dateformat + reuse.datetext + ".png"
              );
          });
        } else {
          api_status = "F"; // Fail
          res.json({ api_status });
        }
      } else if (positive > 0) {
        if (positive > 80) {
          var resultATK = 2; //Positive
          res.json({ api_status, resultATK });
          Jimp.read(buffer, (err, res) => {
            if (err) throw new Error(err);
            var file = res
              .quality(5)
              .write(
                "./PictureATK/" + reuse.dateformat + reuse.datetext + ".png"
              );
          });
        } else {
          api_status = "F"; // Fail
          res.json({ api_status });
        }
      }
    } catch (error) {
      console.log(error);
      console.log("------------------ Error ------------------");
      console.error("Error with the request:", error);
    }
  }

  machineLearningResult().then();
  module.exports.machineLearningResult = machineLearningResult;
});

const port = process.env.PORT || 3131;
app.listen(port, () => console.log(`Listening on port ${port}.....`));
