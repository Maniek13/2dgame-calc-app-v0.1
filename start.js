const express = require('express');

const app = express();

const routes = require('./files/routes')

routes(app);

app.listen(8080);



