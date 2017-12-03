function lookup(){
  var name= window.location.hash.replace("#","");
 //document.getElementById("left").innerHTML = name
 
//var filedata = $.getJSON("test.json");
$.ajax({
  dataType: "json",
  url: "/fetchUserFile",
  success: function(res){
	
  recommendBuilder(res.users[name].genres);
  var Songs = res.users[name].Songs;
  var list = document.getElementById('recentSongsList');
  var innerHTML = "";
  for(var keys in Songs){
	innerHTML += '<li class="list-group-item" onClick="onClickSongListen(\''+keys+'\')">'+keys+' <span class="badge">'+Songs[keys]+'</span></li>';
  }
  list.innerHTML += innerHTML;
  
  /*var table = document.getElementById('table_songs');
  var thead=document.createElement('thead');
  var th1=document.createElement('th');
  var th2=document.createElement('th');
  var tr1 = document.createElement('tr');
  var text3 = document.createTextNode("Song");
  var text4 = document.createTextNode("Count");
  th1.appendChild(text3);
  th2.appendChild(text4);
  tr1.appendChild(th1);
  tr1.appendChild(th2);
  thead.appendChild(tr1);
  table.appendChild(thead);
  var tbody=document.createElement('tbody');
  for (var obj in keys){

      var tr = document.createElement('tr');

      var td1 = document.createElement('td');
      var td2 = document.createElement('td');

      var text1 = document.createTextNode(obj);
      var text2 = document.createTextNode(res.users[name].Songs[obj]);


      td1.appendChild(text1);
      td2.appendChild(text2);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tbody.appendChild(tr);
      table.appendChild(tbody);
}*/
  },
  error: function(res){
    console.log("error");
  }
});
}

function recommendBuilder(listOfGenres){
	//var listOfGenres = ['rock','dance','edm'];
	var div = document.getElementById('table_recommend').parentElement;
	div.style.overflow = "auto";
	
	for(var i=0;i<listOfGenres.length;i++){
		var key = listOfGenres[i];
		var counter = i;
		
		(function(key,counter) {
			$.ajax({
				url:'/search',
				data:{searchKey: key, category:'Tag/Genre'},
				success: function(res){
					
					if(typeof res == 'string')
						res = JSON.parse(res);
					
					var htmlOutput='<div class="panel panel-primary" style="max-height:400px; overflow:hidden;">'+
					  '<div class="panel-heading">'+
						'<h4 class="panel-title">'+
							'<a data-toggle="collapse" href="#collapse'+counter+'">Tag/Genre: ' + key +'</a>'+
						'</h4></div><div id="collapse'+counter+'" class="panel-collapse collapse">'+
					  '<div class="panel-body" style="overflow:auto;max-height:350px;"><table class="table table-bordered"><thead><tr>';
					if(res.results.bindings.length > 0){
						
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
						}
					}else{
						htmlOutput += "</tr></thead><tbody>";
					}
					htmlOutput +='</tbody></table></div></div></div>';
					div.innerHTML = div.innerHTML + htmlOutput;
				}
			});
		}(key,counter));
	}
}

function onClickSongListen(songName){
	var name= window.location.hash.replace("#","");
	
	$.ajax({
				url:'/addSong',
				data:{songName: songName, name:name},
				success: function(res){
					console.log(res);
					alert('Hope you enjoyed the song :)');
				}
	})
}