var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE game_node", function (err, result) {
    if (err) throw err;
    con.end();
    console.log("Database created");
    create_table_user_password();
  });
});


function create_table_user_password(){
con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "game_node"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "CREATE TABLE user_password (id int(11), login VARCHAR(255), password VARCHAR(255))";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table created");
        con.end();
    });
  });
}
