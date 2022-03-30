const datenow = new Date();
const year = datenow.getFullYear() * 1e4;
const month = (datenow.getMonth() + 1) * 100;
const day = datenow.getDate();

// date format ==> 2022-03-30
const todayDate = new Date().toISOString().slice(0, 10);

// convert to string from number => "20220330"
const dateformat = year + month + day + "";

// datetime format => 2022-03-30T04:18:42.299Z
datenow.getFullYear() * 1e4 +
  (datenow.getMonth() + 1) * 100 +
  datenow.getDate() +
  "";

// datetime format => 03/30/2022 11:18:42
const dateStr =
  ("00" + (datenow.getMonth() + 1)).slice(-2) +
  "/" +
  ("00" + datenow.getDate()).slice(-2) +
  "/" +
  datenow.getFullYear() +
  " " +
  ("00" + datenow.getHours()).slice(-2) +
  ":" +
  ("00" + datenow.getMinutes()).slice(-2) +
  ":" +
  ("00" + datenow.getSeconds()).slice(-2);

// Time Format => hh:mm:ss (EX: 114535)
const datetext =
  datenow.getHours() + "" + datenow.getMinutes() + "" + datenow.getSeconds();

module.exports.dateformat = dateformat;
module.exports.datenow = datenow;
module.exports.dateStr = dateStr;
module.exports.datetext = datetext;
module.exports.todayDate = todayDate;
