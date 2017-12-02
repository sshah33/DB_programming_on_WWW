//http://dbtune.org/musicbrainz/snorql/?describe=http%3A%2F%2Fdbtune.org%2Fmusicbrainz%2Fresource%2Fartist%2F1138a764-2212-4d0a-b02d-0dc14df91e08
counter = 0;
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
		errLabel.innerHTML = errLabel.innerHTML.replace(/ *\([^)]*\) */g, "("+counter+")");
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
	var textData;
	var selectData;
	
	for(var i=0;i<searchDivs.length;i++)
	{
		textData = searchDivs[i].querySelector("input").value;
		selectData = searchDivs[i].querySelector("select").value;
	}
	
	$.ajax({
		url:'/search',
		data:{searchKey:textData , category:selectData},
		success: function(res){
			debugger;
		}
	})
}

document.addEventListener('DOMContentLoaded', function() {
   addSearchBoxes('searchArea');
}, false);
