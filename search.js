//http://dbtune.org/musicbrainz/snorql/?describe=http%3A%2F%2Fdbtune.org%2Fmusicbrainz%2Fresource%2Fartist%2F1138a764-2212-4d0a-b02d-0dc14df91e08
counter = 0;
selectOptionsReference = {
	'Artist':'mo:MusicArtist', //foaf:maker is list of his/her songs. //foaf:homepage
	//'Release':'mo:Release', //Date rdf:type mo:Release and mo:Record has mo:Release and dc:date. has mo:release_country 
	'Record/Album':'mo:Record', //mo:Record is an album and mo:track is it's track list. and dc:title is it's title.
	//'Place':'', //Concert
	'Track':'mo:Track', //mo:Release has mo:release_label and foaf:based_near we can get country. vocab:label_name gets me the search string.
	'Tag/Genre':'tags:taggedWithTag', //vocab:tag_count , rdf:type tags:Tag
	//'Instrument':'',
	//'Event':''
}

selectOptionsUsed= {
	'Artist':0, //foaf:maker is list of his/her songs. //foaf:homepage
	//'Release':0, //Date rdf:type mo:Release and mo:Record has mo:Release and dc:date. has mo:release_country 
	'Record/Album':0, //mo:Record is an album and mo:track is it's track list. and dc:title is it's title.
	//'Place':0, //Concert
	'Track':0, //mo:Release has mo:release_label and foaf:based_near we can get country. vocab:label_name gets me the search string.
	'Tag/Genre':0, //vocab:tag_count , rdf:type tags:Tag
}

//searchArea
function addSearchBoxes(divName){
	//alert('hey');
	var divElement = document.getElementById("searchArea");
	var errLabel = document.getElementById("lbl_err");
	
	if(counter < 4)
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
	
	var searchDivs = document.getElementsByClassName('searchBox');
	for(var j=0;j<searchDivs.length;j++)
	{
		searchDivs[j].querySelector("select").disabled = true;
	}

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
	var keys = Object.keys(selectOptionsUsed);
	
	for (var i=0;i < keys.length;i++)
	{
		if(selectOptionsUsed[keys[i]] == 1)
		{
			continue;
		}
		var option = new Option (keys[i],keys[i]);
		selectBox.options[selectBox.options.length] = option;
		if(selectBox.options.length == 1)
		{
			selectOptionsUsed[keys[i]] = 1;
		}
	}
	
	selectBox.addEventListener("change", function(evt,a,b,c){
		debugger;
		selectOptionsUsed[evt.currentTarget.value] = 1;
		for(var i=0;i<evt.currentTarget.options.length;i++)
		{
			if(evt.currentTarget.options.selectedIndex != evt.currentTarget.options[i].index)
				selectOptionsUsed[evt.currentTarget.options[i].value] = 0;
		}
	});
	
	div.appendChild(selectBox);
	div.insertAdjacentHTML('beforeend','<i class="fa fa-times fa-2x" onClick="onDeleteSearchBox(\''+div.id+'\');"></i>');
	
	return div;
}

function onDeleteSearchBox(divId){
	var div = document.getElementById(divId);
	var errLabel = document.getElementById("lbl_err");
	var value = div.querySelector("select").value;
	
	selectOptionsUsed[value] = 0;
	
	if(div.previousElementSibling){
		div.previousElementSibling.querySelector('select').disabled=false;
	}
	
	if(div){
		counter--;
		div.remove();
		errLabel.style.visibility = "hidden";
	}
}

/*function onSearchClick(){
	var searchDivs = document.getElementsByClassName('searchBox');
	var div = document.getElementById("resultDiv");
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
			
			if(typeof res == 'string')
				res = JSON.parse(res);
			
			debugger;
			var htmlOutput='<div class="panel panel-primary" style="height:400px; overflow:auto;">'+
			  '<div class="panel-heading">'+selectData+ ': ' + textData +'</div>'+
			  '<div class="panel-body"><ul class="list-group">';
			
			for(var i=0;i<res.length;i++){
				htmlOutput +='<li class="list-group-item list-group-item-info">'+res[i].list.value+'</li>';
			}
			
			htmlOutput +='</ul></div></div>';
			div.innerHTML = htmlOutput;
		}
	})
}*/

function onSearchClick(){
	var searchDivs = document.getElementsByClassName('searchBox');
	var div = document.getElementById("resultDiv");
	var textData = [];
	var selectData = [];
	
	for(var i=0;i<searchDivs.length;i++)
	{
		textData.push(searchDivs[i].querySelector("input").value);
		selectData.push(searchDivs[i].querySelector("select").value);
	}
	
	$.ajax({
		url:'/search',
		data:{searchKey:textData , category:selectData},
		success: function(res){
			
			if(typeof res == 'string')
				res = JSON.parse(res);
			
			debugger;
			var htmlOutput='<div class="panel panel-primary" style="height:400px; overflow:hidden;">'+
			  '<div class="panel-heading">'+selectData+ ': ' + textData +'</div>'+
			  '<div class="panel-body" style="overflow:auto;max-height:350px;"><table class="table table-bordered"><thead><tr>';
			
			for(var i=0;i<res.head.vars.length;i++){
				htmlOutput +='<th>'+res.head.vars[i]+'</th>';
			}
			htmlOutput += "</tr></thead><tbody>";
			for(var i=0;i<res.results.bindings.length;i++){
				var details = res.results.bindings[i];
				htmlOutput +='<tr onClick="onClickSongListen(\''+(details.SongName ? details.SongName.value : details.AlbumTitle.value)+'\')">';
				for (var prop in details)
				{
					if(prop == 'coverArt'){
						htmlOutput +='<td><img src="'+details[prop].value+'"></a></td>';
					}
					else{
						htmlOutput +='<td>'+details[prop].value+'</td>';
					}
					
				}
				
				htmlOutput +='</tr>';
				/*
				<tr>
					<td>July</td>
					<td>Dooley</td>
					<td>july@example.com</td>
				</tr>*/
			}
			
			htmlOutput +='</tbody></table></div></div>';
			div.innerHTML = htmlOutput;
		}
	})
}

document.addEventListener('DOMContentLoaded', function() {
   addSearchBoxes('searchArea');
}, false);
