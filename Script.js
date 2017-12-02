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


//------------------------------------------------------------------------- -----------------------------------------------------------------------------//


app.get('/search', function(req,res){
	console.log(req.query);
	fetchArtist(selectOptionsReference[req.query.category],req.query.searchKey,res);
});


selectOptionsReference = {
	'Artist':'mo:MusicArtist', //foaf:maker is list of his/her songs. //foaf:homepage
	'Release':'mo:Release', //Date rdf:type mo:Release and mo:Record has mo:Release and dc:date. has mo:release_country 
	'Record/Album':'mo:Record', //mo:Record is an album and mo:track is it's track list. and dc:title is it's title.
	'Place':'', //Concert
	'Label':'mo:Label', //mo:Release has mo:release_label and foaf:based_near we can get country. vocab:label_name gets me the search string.
	'Tag/Genre':'tags:taggedWithTag', //vocab:tag_count , rdf:type tags:Tag
	'Instrument':'',
	//'Event':''
}




sparql = require('sparql');
client = new sparql.Client('http://dbtune.org/musicbrainz/sparql');
//http://dbtune.org/musicbrainz/sparql
const PREFIX_QUERY = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"+
"PREFIX mo: <http://purl.org/ontology/mo/> \n"+
"PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n"+
"PREFIX tags: <http://www.holygoat.co.uk/owl/redwood/0.1/tags/>\n"+
"PREFIX ns1: <http://www.w3.org/1999/xhtml/vocab#>\n" +
"PREFIX mbz: <http://purl.org/ontology/mbz#>\n"+
"PREFIX owl: <http://www.w3.org/2002/07/owl#>\n"+
"PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n"+
"PREFIX bio: <http://purl.org/vocab/bio/0.1/>\n"+
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n"+
"PREFIX geo: <http://www.geonames.org/ontology#>\n"+
"PREFIX lingvoj: <http://www.lingvoj.org/ontology#>\n"+
"PREFIX rel: <http://purl.org/vocab/relationship/>\n"+
"PREFIX vocab: <http://dbtune.org/musicbrainz/resource/vocab/>\n"+
"PREFIX event: <http://purl.org/NET/c4dm/event.owl#>\n"+
"PREFIX map: <file:/home/moustaki/work/motools/musicbrainz/d2r-server-0.4/mbz_mapping_raw.n3#>\n"+
"PREFIX db: <http://dbtune.org/musicbrainz/resource/>\n"+
"PREFIX dc: <http://purl.org/dc/elements/1.1/>\n";


var select = "select ?s ?p ?o where {?s rdf:type mo:MusicArtist . ?s ?p ?o} limit 10";

var describeQuery = "SELECT DISTINCT ?property ?hasValue ?isValueOf" +
"WHERE { "+
"  { <http://dbtune.org/musicbrainz/resource/artist/1138a764-2212-4d0a-b02d-0dc14df91e08> ?property ?hasValue } "+
"  UNION "+
"  { ?isValueOf ?property <http://dbtune.org/musicbrainz/resource/artist/1138a764-2212-4d0a-b02d-0dc14df91e08> } "+
"} "+
"ORDER BY (!BOUND(?hasValue)) ?property ?hasValue ?isValueOf";

var genericFetchQuery = "select DISTINCT ?property ?hasValue ?isValueOf where "
+"{{?s rdf:type |type| . ?s |property| '|value|' . ?s  ?property ?hasValue} "
+"UNION {?s rdf:type |type| . ?s |property| '|value|' . ?isValueOf ?property ?s}}"+
"ORDER BY (!BOUND(?hasValue)) ?property ?hasValue ?isValueOf";

function getInitialUserTrackList(genreList,songsList){
	var query = "";
	
	client.query(query, function(err, res){ console.log(res ? res.results.bindings : err) });
}

function fetchArtist(type,value,resp,callBack){
	var query = PREFIX_QUERY + " " +genericFetchQuery.replace(/\|type\|/g,type).replace(/\|property\|/g,"foaf:name").replace(/\|value\|/g,value);
	
	console.log(query);
	
	try{
		client.query(query, function(err, res){
			console.log(res ? res.results : err);
			resp.send(res);
		});
	}
	catch(err){
		console.log(err);
		resp.send('error');
	}
}

//------------------------------------------------------------------------- -----------------------------------------------------------------------------//



app.listen(8888);
