//http://dbtune.org/musicbrainz/snorql/?describe=http%3A%2F%2Fdbtune.org%2Fmusicbrainz%2Fresource%2Fartist%2F1138a764-2212-4d0a-b02d-0dc14df91e08
counter = 0;

selectOptionsReference = {
	'Artist':'mo:MusicArtist', //foaf:maker is list of his/her songs.
	'Release':'', //Date rdf:type mo:Release and mo:Record has mo:Release and dc:date. has mo:release_country
	'Record/Album':'', //mo:Record is an album and mo:track is it's track list. and dc:title is it's title.
	'Place':'', //Concert
	'Label':'mo:Label', //mo:Release has mo:release_label and foaf:based_near we can get country. vocab:label_name gets me the search string.
	'Tag/Genre':'tags:taggedWithTag', //vocab:tag_count , rdf:type tags:Tag
	'Instrument':'',
	//'Event':''
}

/*sparql = require('sparql');
client = new sparql.Client('http://dbtune.org/musicbrainz/snorql/');
const PREFIX_QUERY = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"+
"PREFIX mo: <http://purl.org/ontology/mo/> \n"+
"PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n"+
"PREFIX tags: <http://www.holygoat.co.uk/owl/redwood/0.1/tags/>\n"+
"PREFIX ns1: <http://www.w3.org/1999/xhtml/vocab#>\n";
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

function querySparqlEndpoint(options){

}

function getInitialUserTrackList(genreList,songsList){
	var query = "";

	client.query(query, function(err, res){ console.log(res ? res.results.bindings : err) });
}

function fetchArtist(artistName,callBack){
	var query = " SELECT DISTINCT ?instance WHERE { ?instance a <http://purl.org/ontology/mo/MusicArtist> . ?instance foaf:name "+ artistName +"} ORDER BY ?instance ";
	client.query(query, callBack(err, res));
}
*/
//searchArea
function addSearchBoxes(divName){
	//alert('hey');
	var divElement = document.getElementById("searchArea");
	var errLabel = document.getElementById("lbl_err");

	if(counter < 5)
	{
		var searchField = createSearhField();
		divElement.appendChild(searchField);
	}
	else{
		errLabel.innerHTML = errLabel.innerHTML.replace(/ \([^)]\) */g, "("+counter+")");
		errLabel.style.visibility = "visible";
	}

}

function createSearhField(){

	var div = document.createElement("div");
	div.id = "searchBox"+ ++counter;
	div.className = "searchBox";

	var input = document.createElement("input");
	input.type = "text";
	input.placeholder = "Search Query";
	input.className = "searchTextField form-control fixedwidth"; // set the CSS class
	div.appendChild(input); // put it into the DOM

	var selectBox = document.createElement("select");
	selectBox.className = "form-control fixedwidth";
	var keys = Object.keys(selectOptionsReference);
	for (var i=0;i < keys.length;i++)
	{
		var option = new Option (keys[i],keys[i]);
		selectBox.options[selectBox.options.length] = option;
	}
	div.appendChild(selectBox);
	div.insertAdjacentHTML('beforeend','<i class="fa fa-times fa-2x" onClick="onDeleteSearchBox(\''+div.id+'\');"></i>');

	return div;
}

function onDeleteSearchBox(divId){
	var div = document.getElementById(divId);
	var errLabel = document.getElementById("lbl_err");

	if(div){
		counter--;
		div.remove();
		errLabel.style.visibility = "hidden";
	}
}

function onSearchClick(){
	var searchDivs = document.getElementsByClassName('searchBox');
	var query = "select ?s ?p ?o where {?s rdf:type mo:MusicArtist . ?s ?p ?o}";

	for(var i=0;i<searchDivs.length;i++)
	{

	}
}

document.addEventListener('DOMContentLoaded', function() {
   addSearchBoxes('searchArea');
}, false);
