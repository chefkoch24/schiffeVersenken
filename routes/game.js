var express = require("express");
var router = express.Router();

module.exports= function(io){
    const WATER = 0;
    const SHIP = 1;
    const MISSED_SHOOT = -1;
    const HIT = 2;
    const ROWS = 10;
    const COLUMNS = 10;

    let playerNames = [];
    let playerIDs = [];
    let playerBoards = [];
    let playerSockets = [];

    io.on("connection", function(socket){
        playerSockets.push(socket);
        let socketIndex = playerSockets.indexOf(socket);

        socket.on("setPlayerInformation", function(data){
            playerIDs[socketIndex] = data.id;
            playerBoards[socketIndex] = data.board;
            // Inform who begins
            if(socketIndex % 2 == 1){
                playerSockets[socketIndex].emit("beginner", false);
                playerSockets[socketIndex-1].emit("beginner", true);
            }
            // Inform about the other playerName
            if(socketIndex % 2 == 1){
                playerSockets[socketIndex].emit("opponentName", {name: playerNames[socketIndex-1]});
            }else{
                playerSockets[socketIndex].emit("opponentName", {name: playerNames[socketIndex+1]});
            }
        });

        socket.on("shoot", function(data){
            if(socketIndex % 2 == 0){
            // check opponent board
                let hit = checkShoot(data.x, data.y,playerBoards[socketIndex+1]);
                // inform the shooted player about his result
                playerSockets[socketIndex].emit("shootResult", {x: data.x,y: data.y, val: hit});
                // inform the opponent where the other shooted
                playerSockets[socketIndex+1].emit("opponentShoot",{x: data.x,y: data.y, val: hit});
            }else{
            // check opponent board
                let hit = checkShoot(data.x, data.y,playerBoards[socketIndex-1]);
                // inform the shooted player about his result
                playerSockets[socketIndex].emit("shootResult", {x: data.x,y: data.y, val: hit});
                // inform the opponent where the other shooted
                playerSockets[socketIndex-1].emit("opponentShoot",{x: data.x,y: data.y, val: hit});
            }
        });

        socket.on("saveName", function(data){
            playerNames[socketIndex] = data.name;
            if(socketIndex % 2 == 1){
                playerSockets[socketIndex].emit("opponentName", {name: playerNames[socketIndex -1]});
                playerSockets[socketIndex-1].emit("opponentName", {name: playerNames[socketIndex]});
            }
        });
        socket.on("winner", function (){
            if(socketIndex % 2 == 0){
                playerSockets[socketIndex+1].emit("looser");
            }else{
                playerSockets[socketIndex-1].emit("looser");
            }
        });


    });

    function checkBoard(board, posX, posY){
        if(board[posX][posY] == SHIP){
            board[posX][posY] = HIT;
            return true;
        }else{
            board[posX][posY] = MISSED_SHOOT;
            return false;
        }
    }

    function checkShoot(posX, posY, board){
        if(board[posX][posY] == SHIP){
            return true;
        }else{
            return false;
        }
    }

    return router;
};
