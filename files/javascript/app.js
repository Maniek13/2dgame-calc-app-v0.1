var odpowiedz;

async function sprawdz(){
let login = Number(document.getElementById("login").value);
let password = Number(document.getElementById("password").value);

let adres = "http://localhost:8080/login?";
adres += "login=" + login;
adres +=  "&password=" + password;

let wynik_login = httpGet(adres);
let promise = new Promise((resolve, reject) => {
		setTimeout(() => resolve(wynik_login), 300);
});
let result = await promise;
	
result = JSON.parse(odpowiedz);

if(result != ""){
  let adres2 = "http://localhost:8080/app?";
  adres2 += "login=" + login;
  window.location.replace(adres2);
}
else{
  document.getElementById("wynik").innerText = "Wrong data";
}
}


function httpGet(theURL) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theURL);
  xmlHttp.setRequestHeader("Content-Type", "application/json");
  xmlHttp.send(null);

  var response = null;
  xmlHttp.onreadystatechange = function() {
    
    if(xmlHttp.readyState == XMLHttpRequest.DONE) {
      response = xmlHttp.responseText;
     odpowiedz = response;

    }
  };
}