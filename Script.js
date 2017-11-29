var http = require('http');
var fs = require('fs');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express()

app.use(express.static(path.join(__dirname, '.')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json

app.get('/home', function (req, res) {
var tempPath = "./index.html";
res.sendFile(path.resolve(tempPath));
});

app.get('/userLogin', function (req, res) {
var tempPath = "./login.html";
res.sendFile(path.resolve(tempPath));
});

app.get('/fetchUserFile', function (req, res) {
var tempPath = "./json/userinfo.json";
res.sendFile(path.resolve(tempPath));
});

app.post('/storeUserInfo', function (req, res) {
console.log('hello');
var info = req.body;
info["Songs"] = {};
info["Password"] = "mypassword";
var filedata = readFile("./json/userinfo.json");
console.log(filedata);
filedata.users[info["firstName"]] = info;
writeFile("./json/userinfo.json", filedata);
res.redirect("/login.html");
});

function readFile(filepath){
  var contents = fs.readFileSync(filepath, 'utf8');
  return JSON.parse(contents);
}

function writeFile(filepath, content){
  fs.writeFileSync(filepath, JSON.stringify(content), function (err) {
  if (err) throw err;
  console.log('Saved!');
});
}

app.post('/userSubmit', function (req, res) {
console.log('login');
var info = req.body;
console.log(info["password"]);
var filedata = readFile("./json/userinfo.json");
for (var obj in filedata.users)
{
  if(filedata.users[obj].firstName == info["name"] && filedata.users[obj].Password == info["password"])
  {
    console.log("name and password match!!");
    res.redirect("/home.html#"+info["name"]);
  }
}
});


app.listen(8888);
