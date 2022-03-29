const readFileSync = require("fs");
//Test
const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ type: "*/*" }));

const util = require("util");
const fs = require("fs");
const PredictionApi = require("@azure/cognitiveservices-customvision-prediction");
const msRest = require("@azure/ms-rest-js");

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

async function machineLearningResult() {
  try {
    const results = await predictor.detectImage(
      "82841321-2493-42c9-a7f4-55bd255771fc",
      publishIterationName,
      inputFile
    );
    var createdate = results.created;
    console.log("createdate: ", createdate);
    console.log(results);
    console.log("------------------ Pass ------------------");
    results.predictions.forEach((predictedResult) => {
      console.log(
        `\t ${predictedResult.tagName}: ${(
          predictedResult.probability * 100.0
        ).toFixed(2)}%`
      );
    });
  } catch (error) {
    console.log(error);
    console.log("------------------ Error ------------------");
    console.error("Error with the request:", error);
  }
}

machineLearningResult().then();
module.exports.machineLearningResult = machineLearningResult;
