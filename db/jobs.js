const fs = require("fs");

console.log(process.cwd());

module.exports = fs
  .readFileSync("C:\\Users\\itudo\\Desktop\\server\\db\\jobsdb.txt", "utf8")
  .split("\r\n");
//console.log(fs.readFileSync("../db/jobsdb.txt", "utf8").split());
