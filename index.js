// run npm install (and npm install -g miio to discover devices)

const air = require("./air.js");

console.log("CANCEL at any time using CTRL+C.\n");

air.managePollution();