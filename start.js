var http = require('http');
var url = require('url');
var fs = require('fs');
var mysql = require('mysql');
const express = require('express');

function path(req){
  let pathname = url.parse(req.url).pathname;
  let paths = pathname.split("/");
  paths.reverse().pop();
  
  return paths.reverse();
}

function parametrs(req){
  let query = url.parse(req.url).query;
  let parametrs = {};

  if(query){
    query.split("&").forEach( function(element){
      let el = element.split("=");
      parametrs[el[0]] = el[1];
    })
  }
  return parametrs;
}

function calc(operation, params){
  let wynik = "";

  let number1 = params.number1;
  let number2 = params.number2;

  switch(operation[1]){
    case undefined : 
      wynik = "Wpisz calc/action?number1=X&number2=Y, Gdzie action = {add, multiply, division, substraction} a X i Y to liczby do policzenia";
      break;

    case "add" :
      wynik = (parseFloat(number1)*counter(number1, number2)  + parseFloat(number2)*counter(number1, number2) )/ counter(number1, number2);
      break;

    case "multiply" :
      wynik = parseFloat(number1)*counter(number1, number2)* parseFloat(number2)*counter(number1, number2)/counter(number1, number2)/counter(number1, number2);
      break;
    
    case "division" :
      if( parseFloat(number2) != 0){
        wynik = parseFloat(number1)*counter(number1, number2)/ parseFloat(number2)*counter(number1, number2);
      }
      wynik = "nie można dzielić przez zero"; 
      break;

    case "substraction" :
      wynik = parseFloat(number1)*counter(number1, number2) - parseFloat(number2)*counter(number1, number2);
      break;
  }
  return wynik.toString();
}

function core(operation, params, callback){
  return callback(operation, params);
}

function counter(number1, number2){
  let a = number1.indexOf(".");
  let b = number2.indexOf(".");

  if(a !== -1|| b !== -1){
    let t1 = number1.substring(number1.indexOf("."));
    let t2 = number2.substring(number2.indexOf("."));
    
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

async function game_answer(login, password){
  let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "game_node"
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


const app = express();

app.use(express.static('files'));

app.get('/', (req, res) => {
  page_html('./pages/index.html', res);
});

app.get('/game', (req, res) => {
     page_html('./pages/game.html', res);
});

app.get('/application', (req, res) => {
  page_html('./pages/start.html', res);
});


app.get('/login', (req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
    let data = parametrs(req);
    game_answer(data.login, data.password).then(results => {
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


app.get(['/calc', '/calc/add', 'calc/multiply', 'calc/division', 'calc/substraction'], (req, res) => {
  res.end(core(path(req), parametrs(req), calc));
});


app.listen(8080);


function page_html(name, res){
  fs.readFile(name, null, function (error, data) {
    if (error) {
      res.writeHead(404);
      res.write("File not found!");
    } else {
      res.write(data);
    }
    res.end();
  });
}
