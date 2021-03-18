var reply;

async function check(){
  let login = Number(document.getElementById("login").value);
  let password = Number(document.getElementById("password").value);

  let adres = "http://localhost:8080/login?";
  adres += "login=" + login;
  adres +=  "&password=" + password;

  let result_login = httpGet(adres);

  let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve(result_login), 300);
  });
  let result = await promise;
    
  result = JSON.parse(reply);

  if(result != "" && result != "error"){
    let adres2 = "http://localhost:8080/app?";
    adres2 += "login=" + login;
    window.location.replace(adres2);
  }
  else if(result == ""){
    document.getElementById("message").innerText = "Wrong data";
  }
  else{
    document.getElementById("message").innerText = "Database error";
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
      reply = response;
    }
  };
}