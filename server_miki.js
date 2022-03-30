const { Connection, Request } = require("tedious");
const express = require("express");
const dbconf = require("./dbconfig");
const readFileSync = require("fs");
const app = express();
const cors = require("cors");
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

  const inputFile = fs.readFileSync(`./PictureATK/images.jpg`);
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

      //var result = arrayPredictions.probability * 100.0;

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
