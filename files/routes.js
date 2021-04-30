'use strict';
const express = require('express');


const controller = require('./controller')

module.exports = function(app) {
    app.use(express.static('files'));

    app.get('/', (req, res) => {
        controller.page_html('./pages/index.html', res);
    });
    
    app.get('/game', (req, res) => {
        controller.page_html('./pages/game.html', res);
    });
    
    app.get('/application', (req, res) => {
        controller.page_html('./pages/start.html', res);
    });
    
    
    app.get('/login', (req, res) => {
      res.writeHead(200, {'Content-Type': 'application/json'});
        let data = controller.parametrs(req);
        controller.game_answer(data.login, data.password).then(results => {
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
    
    
    app.get(['/calc', '/calc/add', '/calc/multiply', '/calc/division', '/calc/substraction'], (req, res) => {
      res.end(controller.core(controller.path(req), controller.parametrs(req), controller.calc));
    });
    
}
