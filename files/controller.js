'use strict';

var url = require('url');
var fs = require('fs');
var mysql = require('mysql');

function counter (number1, number2){
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

var controller = {
  page_html: function (name, res){
    fs.readFile(name, null, function (error, data) {
      if (error) {
        res.writeHead(404);
        res.write("File not found!");
      } else {
        res.write(data);
      }
      res.end();
    });
  },
  path: function (req){
    let pathname = url.parse(req.url).pathname;
    let paths = pathname.split("/");
    paths.reverse().pop();
    
    return paths.reverse();
  },
  parametrs: function (req){
    let query = url.parse(req.url).query;
    let parametrs = {};
  
    if(query){
      query.split("&").forEach( function(element){
        let el = element.split("=");
        parametrs[el[0]] = el[1];
      })
    }
    return parametrs;
  },
  calc: function (operation, params){
    let wynik = "";
  
    let number1 = params.number1;
    let number2 = params.number2;
    switch(operation[1]){
      case undefined: 
          wynik = "Wpisz calc/action?number1=X&number2=Y, Gdzie action = {add, multiply, division, substraction} a X i Y to liczby do policzenia";
        break;
      case "add":
          wynik = (parseFloat(number1)*counter(number1, number2)  + parseFloat(number2)*counter(number1, number2) )/ counter(number1, number2);
        break;
      case "multiply":
        wynik = parseFloat(number1)*counter(number1, number2)* parseFloat(number2)*counter(number1, number2)/counter(number1, number2)/counter(number1, number2);
        break;
      case "division":
            if( parseFloat(number2) != 0){
              wynik = (parseFloat(number1)*counter(number1, number2)) / (parseFloat(number2)*counter(number1, number2));
            }
            else{
              wynik = "nie można dzielić przez zero"; 
            }
        break;
      case "substraction" :
          wynik = (parseFloat(number1)*counter(number1, number2) - parseFloat(number2)*counter(number1, number2))/counter(number1, number2);
        break;
    }
    return wynik.toString();
  },
  core: function (operation, params, callback){
    return callback(operation, params);
  },
  game_answer: async function (login, password){
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

};

module.exports = controller;