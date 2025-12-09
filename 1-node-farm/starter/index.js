const fs = require("fs");

const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn);

//text for new text file. .\n starts a new line.
const textOut = `Updating avocado file: ${textIn} .\n ${Date.now()}`;
//creates new text file. output.txt is new name. textOut is data for new file.
fs.writeFileSync("./txt/output.txt", textOut);
