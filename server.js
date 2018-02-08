
const express = require("express");
const app     = express();
const bodyParser = require("body-parser");
const port = 3000;
const path = require("path");
const server  = app.listen(port , function(){
    console.log("Server started on port" + port);
});
const io      = require("socket.io").listen(server);


var highscore = require("./routes/highscore");
var game = require("./routes/game")(io);

// body parser useing
app.use(bodyParser.json());

// static elements
app.use(express.static(path.join(__dirname, "/client")));

// Router verwenden
app.use("/api/highscore", highscore);
app.use("/api", game);

// first page
app.get("/", function(req, res){
    res.sendFile(__dirname + "/client/schiffeVersenken.html");
});

//page that doesn't exist
app.get("/*", (req, res) => {
    res.status(404).sendFile(__dirname + "/client/404.html");
});

// save all players
var players = [];

io.on("connection", function(socket){
// an new player connected
    players.push(socket);
    console.log("a user connected");
    socket.on("disconnect", function() {
        // in every game is one player with a even index in the array and an odd index
        let socketIndex = players.indexOf(socket);
        // one socket disconnect and the oppoent get the information
        if(socketIndex % 2 == 0){
            if(!(typeof players[socketIndex+1] === "undefined"))
                players[socketIndex+1].emit("opponentDisconnected");
        }
        if(socketIndex % 2 == 1){
            if(!(typeof players[socketIndex-1] === "undefined"))
                players[socketIndex-1].emit("opponentDisconnected");
        }
        console.log("a user disconnected");
    });
});
