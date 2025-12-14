const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require("slugify");

const tempReplace = require("./modules/tempReplace.js");

////////////////
//READING/WRITING FILES

// //BLOCKING/SYNCHRONOUS WAY:
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// //console.log(textIn);

// //text for new text file. .\n starts a new line.
// const textOut = `Updating avocado file: ${textIn} .\n ${Date.now()}`;
// //creates new text file. output.txt is new name. textOut is data for new file.
// fs.writeFileSync("./txt/output.txt", textOut);

// //NON-BLOCKING/ASYNCHRONOUS WAY(VIDE0 #10):
// //reads file of start.txt, then when file is done being read in background, callback function is called.
// //this callback is the (err, data). always put err first. if there is error will print error, if not then data.
// //this is a callback loop that pretty much reads the start file, the content is "read-this" which becomes data1.
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR");
//   //then "read-this.txt" is read and printed
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     //then the same for append.txt
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       //finally make a file called "final.txt" and add "read-this.txt" and "append.txt"
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, (err) => {
//         console.log("final text has been written!");
//       });
//     });
//   });
// });

////////////////////
//SERVER
//function that takes in the temp html file, and one object from the productData array. it replaces all placeholders with their counterpart from productData and returns the updated HTML.

//its easier to have json read up here than in if statements because it will only be ran once, so its also ok to use sync.
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
//json.parse turns json into js.
const productData = JSON.parse(data);

const server = http.createServer((req, res) => {
  //the paths are for urls ex: ("127.0.0.1:800/product" will = "welcome to product")
  // sets query to whatever query is set to when url is parsed, and same for pathname
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW
  if (pathname === "/" || pathname === "/overview") {
    //res.end is server sending response to website.
    res.writeHead(200, { "content-type": "text/html" });

    const cardsHtml = productData
      //makes a new array of 5 objects, but each object(element) is being put through tempReplace with the temp html file.
      //Since productData is an array of 5 objects, element is one object at a time.
      .map((element) => tempReplace(tempCard, element))
      //the array is joined as a string
      .join("");
    //replaces the area with PRODUCTS_CARDS with all the updated html sections.
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
    //PRODUCT
  } else if (pathname === "/product") {
    res.writeHead(200, { "content-type": "text/html" });
    //gets the query id number from url and uses it to choose which object from array to select.
    const product = productData[query.id];
    //uses the correct object(ex: goat and sheep cheese) and the product template to make the html for that goat cheese section.
    //it uses the the same tempReplace function that switches the generic content in the template with real data from JSON file(productData).
    const output = tempReplace(tempProduct, product);
    res.end(output);
    //API
  } else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);
    //NOT FOUND
  } else {
    //this gives status code to network tab in dev tools
    res.writeHead(404);
    res.end("Page not found");
  }
});

//tells the server to turn on and start listening to requests.
server.listen(8000, "127.0.0.1", () => {
  console.log("server listening");
});
