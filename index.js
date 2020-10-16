const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homefile = fs.readFileSync("index.html", "utf-8");
const replaceVal = (tempVal , orgValue)=>{
    let temperature = tempVal.replace("{%tempVal%}",orgValue.main.temp);
    temperature = temperature.replace("{%tempmin%}",orgValue.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgValue.main.temp_max);
    temperature = temperature.replace("{%location%}",orgValue.name);
    temperature = temperature.replace("{%country%}",orgValue.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgValue.weather[0].main);
    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests('http://api.openweathermap.org/data/2.5/weather?q=Brahmapur&units=metric&appid=c6154cec80a8d91e9e6034b98c795da4')
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                // console.log(arrData[0].main.temp);
                const realTImeData = arrData.map((val)=> replaceVal(homefile,val)).join("");
                res.write(realTImeData);
                // console.log(realTImeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);

                res.end();
            });
    }
})

server.listen("8000" , "127.0.0.1")