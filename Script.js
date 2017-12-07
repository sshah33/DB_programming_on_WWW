//Down
// Select ?list where {?l rdf:type mo:Track . ?l foaf:maker ?artist . ?artist foaf:name ?name . FILTER(CONTAINS(?name, "Eminem")) . ?l dc:title ?list}


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
  fs.writeFileSync(filepath, JSON.stringify(content));
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

app.get('/addSong', function (req,res){
	var filedata = readFile("./json/userinfo.json");
	for (var obj in filedata.users)
	{
	  if(filedata.users[obj].firstName == req.query.name)
	  {
		console.log(req.query.name);
		if(filedata.users[obj].Songs.hasOwnProperty(req.query.songName)){
			filedata.users[obj].Songs[req.query.songName] = filedata.users[obj].Songs[req.query.songName]+1;
			console.log(filedata.users[obj].Songs[req.query.songName]);
			writeFile("./json/userinfo.json", filedata);
			res.send(filedata.users[obj].Songs[req.query.songName].toString());
		}
		else{
			filedata.users[obj].Songs[req.query.songName] = 1;
			console.log(filedata.users[obj].Songs[req.query.songName]);
			writeFile("./json/userinfo.json", filedata);
			res.send(filedata.users[obj].Songs[req.query.songName].toString());
		}
	  }else{
		//res.send("error");
	  }
	}
});


//------------------------------------------------------------------------- -----------------------------------------------------------------------------//


app.get('/search', function(req,res){
	console.log(req.query);
	var values = req.query.searchKey;
	var category = req.query.category;
	
	if(category.length > 1){
		fetchByGeneric(req.query.category,req.query.searchKey,res);
	}
	else{
		fetchArtist(selectOptionsReference[req.query.category[0]],req.query.searchKey[0],res);
	}
	
	
});


selectOptionsReference = {
	'Artist':'mo:MusicArtist', //foaf:maker is list of his/her songs. //foaf:homepage
	'Track':'mo:Track',
	'Release':'mo:Release', //Date rdf:type mo:Release and mo:Record has mo:Release and dc:date. has mo:release_country
	'Record/Album':'mo:Record', //mo:Record is an album and mo:track is it's track list. and dc:title is it's title.
	'Place':'', //Concert
	'Label':'mo:Label', //mo:Release has mo:release_label and foaf:based_near we can get country. vocab:label_name gets me the search string.
	'Tag/Genre':'tags:taggedWithTag', //vocab:tag_count , rdf:type tags:Tag
	'Instrument':''
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

var fetchSongsList = "Select ?list where {?l rdf:type mo:Track . ?l foaf:maker ?artist . ?artist foaf:name '|value|' . ?l dc:title ?list}"
var fetchSongsPerTag = "Select ?t ?name where {?li rdf:type tags:Tag . ?li tags:tagName '|value|' . ?l tags:taggedWithTag ?li . ?l rdf:type mo:Track . ?l dc:title ?t . ?l foaf:maker ?artist . ?artist foaf:name ?name}";
var fetchSongsPerSongName = "Select * where {?l rdf:type mo:Track . ?l dc:title '|value|' . ?l ?p ?o}";

function getInitialUserTrackList(genreList,songsList){
	var query = "";

	client.query(query, function(err, res){ console.log(res ? res.results.bindings : err) });
}

function fetchByGeneric(categories,values,resp){
	var query = PREFIX_QUERY + " ";
	
	for(var i=0;i<categories.length;i++){
		switch(selectOptionsReference[categories[i]]){
			case 'mo:MusicArtist':
				fetchByGenericQuery = fetchByGenericQuery.replace(/\|ArtistName\|/g,values[i]).replace("?ArtistName",'"'+values[i]+'"');
				break;
			case 'tags:taggedWithTag':
				fetchByGenericQuery = fetchByGenericQuery.replace(/\|tag\|/g,values[i]).replace("?tagName",'"'+values[i]+'"');
				break;
			case 'mo:Record':
				fetchByGenericQuery = fetchByGenericQuery.replace(/\|AlbumTitle\|/g,values[i]).replace("?AlbumTitle",'"'+values[i]+'"');
				break;
			case 'mo:Track':
				fetchByGenericQuery = fetchByGenericQuery.replace(/\|SongName\|/g,values[i]).replace("?SongName",'"'+values[i]+'"');
				break;
		
		}
	}
	
	try{
		fetchByGenericQuery = fetchByGenericQuery.replace(/\"\|ArtistName\|\"/g,"?ArtistName").replace(/\"\|tag\|\"/g,"?tagName").replace(/\"\|AlbumTitle\|\"/g,"?AlbumTitle").replace(/\"\|SongName\|\"/g,"?SongName");
		query += fetchByGenericQuery;
		console.log(query);

		client.query(query, function(err, res){
			console.log(res);
			resp.send(res);
		});
	}
	catch(err){
		console.log(err);
		resp.send('error');
	}
}

function fetchArtist(type,value,resp,callBack){
	var query = PREFIX_QUERY + " ";//+genericFetchQuery.replace(/\|type\|/g,type).replace(/\|property\|/g,"foaf:name").replace(/\|value\|/g,value);
	try{
		switch(type){
			case 'mo:MusicArtist':
				query += fetchByArtistName.replace(/\|ArtistName\|/g,value);
				break;
			case 'tags:taggedWithTag':
				query+= fetchByTagQuery.replace(/\|tag\|/g,value);
				break;
			case 'mo:Record':
				query+= fetchByAlbumTitleQuery.replace(/\|AlbumTitle\|/g,value);
				break;
			case 'mo:Track':
				query+= fetchBySongNameQuery.replace(/\|SongName\|/g,value);
				break;
				
		}

		console.log(query);

		client.query(query, function(err, res){
			console.log(res);
			resp.send(res);
		});
	}
	catch(err){
		console.log(err);
		resp.send('error');
	}
}

//------------------------------------------------------------------------- -----------------------------------------------------------------------------//

var fetchBySongNameQuery = 'Select ?ArtistName ?SongLength ?AlbumTitle ?SongLanguage ?releaseDate ?coverArt where {'+
	'?track rdf:type mo:Track . '+
	'?track dc:title "|SongName|" . '+
	'?track foaf:maker ?artist . '+
	'?artist foaf:name ?ArtistName .'+
	'?track mo:length ?SongLength . '+
	'?rec mo:track ?track . '+
	'?rec dc:title ?AlbumTitle .'+
	'?rec dc:language ?lan .'+
	'?lan rdfs:label ?SongLanguage .'+
	'?rec dc:date ?releaseDate .'+
	'?rec vocab:albummeta_coverarturl ?coverArt'+
'} limit 50';

var fetchByGenericQuery = 'Select DISTINCT ?SongName ?ArtistName ?tagName ?SongLength ?AlbumTitle ?SongLanguage ?releaseDate ?coverArt where {'+
	'?tag rdf:type tags:Tag . '+
	'?tag tags:tagName "|tag|" . '+
	'?track tags:taggedWithTag ?tag . '+
	'?track rdf:type mo:Track . '+
	'?track dc:title "|SongName|" . '+
	'?track foaf:maker ?artist . '+
	'?artist foaf:name "|ArtistName|" .'+
	'?track mo:length ?SongLength .'+
	'?rec mo:track ?track .'+
	'?rec dc:title "|AlbumTitle|" .'+
	'?rec dc:language ?lan .'+
	'?lan rdfs:label ?SongLanguage .'+
	'?rec dc:date ?releaseDate .'+
	'?rec vocab:albummeta_coverarturl ?coverArt'+
	'} limit 50';

var fetchByArtistName = 'Select ?SongName ?SongLength ?AlbumTitle ?SongLanguage ?releaseDate ?coverArt where {'+
	'?track rdf:type mo:Track . '+
	'?track dc:title ?SongName . '+
	'?track foaf:maker ?artist . '+
	'?artist foaf:name "|ArtistName|" .'+
	'?track mo:length ?SongLength . '+
	'?rec mo:track ?track . '+
	'?rec dc:title ?AlbumTitle .'+
	'?rec dc:language ?lan .'+
	'?lan rdfs:label ?SongLanguage .'+
	'?rec dc:date ?releaseDate .'+
	'?rec vocab:albummeta_coverarturl ?coverArt'+
'} limit 50';

var fetchByAlbumTitleQuery = 'Select ?SongName ?ArtistName ?SongLength ?SongLanguage ?releaseDate ?coverArt where {'+
	'?track rdf:type mo:Track . '+
	'?track dc:title ?SongName . '+
	'?track foaf:maker ?artist . '+
	'?artist foaf:name ?ArtistName .'+
	'?track mo:length ?SongLength . '+
	'?rec mo:track ?track . '+
	'?rec dc:title "|AlbumTitle|" .'+
	'?rec dc:language ?lan .'+
	'?lan rdfs:label ?SongLanguage .'+
	'?rec dc:date ?releaseDate .'+
	'?rec vocab:albummeta_coverarturl ?coverArt'+
'} limit 50';

var fetchByTagQuery = 'Select ?SongName ?ArtistName ?SongLength ?AlbumTitle ?SongLanguage ?releaseDate ?coverArt where {'+
'?tag rdf:type tags:Tag . '+
'?tag tags:tagName "|tag|" . '+
'?track tags:taggedWithTag ?tag . '+
'?track rdf:type mo:Track . '+
'?track dc:title ?SongName . '+
'?track foaf:maker ?artist . '+
'?artist foaf:name ?ArtistName .'+
'?track mo:length ?SongLength .'+
'?rec mo:track ?track .'+
'?rec dc:title ?AlbumTitle .'+
'?rec dc:language ?lan .'+
'?lan rdfs:label ?SongLanguage .'+
'?rec dc:date ?releaseDate .'+
'?rec vocab:albummeta_coverarturl ?coverArt'+
'} limit 50';

app.listen(8888);
