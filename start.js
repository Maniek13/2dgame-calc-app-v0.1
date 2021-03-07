var http = require('http');
var url = require('url');
var fs = require('fs');
var mysql = require('mysql');


function path(req){
  var pathname = url.parse(req.url).pathname;
  var paths = pathname.split("/");
  paths.reverse().pop();
  
  return paths.reverse();
}

function parametrs(req){
  var query = url.parse(req.url).query;
  var parametrs = {};

  if(query){
    query.split("&").forEach( function(element){
      var el = element.split("=");
      parametrs[el[0]] = el[1];
    })
  }
  return parametrs;
}

function calc(operation, params){
  let wynik = "";

  let liczba1 = params.liczba1;
  let liczba2 = params.liczba2;

  switch(operation[1]){
    case undefined : 
      wynik = "Wpisz calc/action?liczba1=X&liczba2=Y, Gdzie action = {add, multiply, division, substraction} a X i Y to liczby do policzenia";
      break;

    case "add" :
      wynik = (parseFloat(liczba1)*licznik(liczba1, liczba2)  + parseFloat(liczba2)*licznik(liczba1, liczba2) )/ licznik(liczba1, liczba2);
      break;

    case "multiply" :
      wynik = parseFloat(liczba1)*licznik(liczba1, liczba2)* parseFloat(liczba2)*licznik(liczba1, liczba2)/licznik(liczba1, liczba2)/licznik(liczba1, liczba2);
      break;
    
    case "division" :
      if( parseFloat(liczba2) != 0){
        wynik = parseFloat(liczba1)*licznik(liczba1, liczba2)/ parseFloat(liczba2)*licznik(liczba1, liczba2);
      }
      wynik = "nie można dzielić przez zero"; 
      break;

    case "substraction" :
      wynik = parseFloat(liczba1)*licznik(liczba1, liczba2) - parseFloat(liczba2)*licznik(liczba1, liczba2);
      break;
  }

  return wynik.toString();
}

function core(operation, params, callback){
  return callback(operation, params);
}




function licznik(liczba1, liczba2){
  if(liczba1.indexOf(".") || liczba2.indexOf(".") ){
    var t1 = liczba1.substring(liczba1.indexOf("."));
    var t2 = liczba2.substring(liczba2.indexOf("."));
  

  if(t1.length > t2.length){
      return Math.pow(10, t1.length);
  }
  else{
      return Math.pow(10, t2.length);
  }
}
else{
  return 1;
}
 
 
}

async function odpowiedz(login, password){

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gra"
});

return new Promise((resolve, reject) => { 

    con.connect(function(err) {
      if (err) throw err;
     
      con.query('SELECT * FROM user_password WHERE login = ' + mysql.escape(login) + ' AND password = ' + mysql.escape(password), function (err, result, fields) {
        if (err)throw err;
          resolve(result);
      });
    });
  });
}

const express = require('express');
const app = express();

app.use(express.static('files'));

app.get('/', (req, res) => {
  res.end('Start page');
});

app.get('/gra', (req, res) => {
     page_html('./game.html', res);
});

app.get('/aplication', (req, res) => {
  page_html('./start.html', res);
});


app.get('/login', (req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
    let dane = parametrs(req);
    odpowiedz(dane.login, dane.password).then(results => {
      if(results != ""){
        let array = [];
        array[0] = results[0].id;
        array[1] = results[0].login;
        res.end(JSON.stringify(array));
      }
      else{
        res.end(JSON.stringify(""));
      }
  }).catch(err => {
    console.error(err);
    res.end(JSON.stringify('error'));
  });
});

app.get('/app', (req, res) => {
  res.end('Nie skonczone!');
});

app.get('/app', (req, res) => {
  res.end('Nie skonczone!');
});

app.get(['/calc', '/calc/add', 'calc/multiply', 'calc/division', 'calc/substraction'], (req, res) => {
  res.end(core(path(req), parametrs(req), calc));
});


app.listen(8080);


function page_html(nazwa, res){
  fs.readFile(nazwa, null, function (error, data) {
    if (error) {
      res.writeHead(404);
      res.write("File not found!");
    } else {
      res.write(data);
    }
    res.end();
  });
}
