function lookup(){
  var name= window.location.hash.replace("#","");
 //document.getElementById("left").innerHTML = name
//var filedata = $.getJSON("test.json");
$.ajax({
  dataType: "json",
  url: "/fetchUserFile",
  success: function(res){

  var keys = res.users[name].Songs;
  var table = document.getElementById('table_songs');
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
  }
//  document.getElementById('left').appendChild(table);
     alert("Page is loaded");
  },
  error: function(res){
    console.log("error");
  }
});
}
