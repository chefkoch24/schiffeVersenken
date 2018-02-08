//----------------------------GLOBAL VARIABLES---------------------------------
let myBoard = createField();
let opponentBoard = createField();
const socket =  io();
const playerID = getRandomInt(1000, 999999);
let shootsCounter = 0;
let myTurn;
const view = new View();
const highscore = new Highscore();
let inGame;
let playerName;
let opponentName;

// all kinds of ships with the amount of them
let ships = [
    {name: "battleship" , length: 5, amount: 1},
    {name: "cruiser" , length: 4 , amount: 2},
    {name: "destroyer" , length: 3 , amount: 3},
    {name: "submarine" , length: 2 , amount: 4}
];

// initalizing the game
function initalize(){
    inGame = true;
    highscore.getHighscore();
    setPlayerInformation();
    setShipsRandomly(myBoard);
    view.showPlayerModal();
    view.updateTables(shootsCounter,myTurn, myBoard, opponentBoard);
}

//-----------------------SERVER LISTENER ----------------------------

// Listener for Server Events to realize Realtime
// inform the clients who is the beginner
socket.on("beginner", function(data){
    myTurn = data;
    console.log(myTurn);
    view.updateTables(shootsCounter, myTurn, myBoard, opponentBoard);
});

// get the name of the opponent
socket.on("opponentName", function(data){
    opponentName = data.name;
    if(typeof opponentName === "undefined"){
        document.getElementById("headSp2").innerHTML = "Waiting for Player";
    }else{
        document.getElementById("headSp2").innerHTML = opponentName;
    }

});

// inform that this client is the losser
socket.on("looser", function () {
    view.showLoserModal();
});

// initalize the server with the client/player information
function setPlayerInformation(){
    socket.emit("setPlayerInformation", {id: playerID, name: playerName,board: myBoard});
}

// shoot on an field on the gameboard
function shoot(posX, posY){
    shootsCounter++;
    console.log(posX + ", " + posY);
    socket.emit("shoot", {x: posX, y: posY});
    view.updateTables(shootsCounter,myTurn, myBoard, opponentBoard);
}

// get the result of your shoot from Server
socket.on("shootResult", function(data){
    let hit = data.val;
    let posX = data.x;
    let posY = data.y;
    // mark the shooted position
    if(hit){
        opponentBoard[posX][posY] = HIT;
        myTurn = true;
        if(winner()){
            view.showWinnerModal();
            highscore.setHighscore(playerName, shootsCounter);
            socket.emit("winner");
        }
    }else{
        opponentBoard[posX][posY] = MISSED_SHOOT;
        myTurn = false;
    }
    view.updateTables(shootsCounter,myTurn, myBoard, opponentBoard);
});

// infrom from server where the opponent shoot on your field
socket.on("opponentShoot", function(data){
    let posX = data.x;
    let posY = data.y;
    let hit = data.val;
    if(hit){
        myBoard[posX][posY] = HIT;
        myTurn = false;
    }else{
        myBoard[posX][posY] = MISSED_SHOOT;
        myTurn = true;
    }
    view.updateTables(shootsCounter,myTurn, myBoard, opponentBoard);
});

socket.on("opponentDisconnected", function(){
    view.showOpponentLeaveModal();
});

function winner(){
    let hitCounter = 0;
    for(let i = 0; i < ROWS; i++){
        for (let j = 0; j < COLUMNS; j++){
            if(opponentBoard[i][j] == HIT){
                hitCounter++;
            }
        }
    }
    return hitCounter == 30;
}

//-------------------------SHIP FUNCTIONS-------------------------------

function createField (){
    return [
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
    ];
}

// set all ships randomly on the gameboard
function setShipsRandomly(board){
    for(let i = 0; i < ships.length; i++){
        for(let j = 0; j < ships[i].amount; j++){
            while(!setShip(board, ships[i])){
            }
        }
    }
}

function setShip(field, ship){
    let x = getRandomInt(0,9);
    let y = getRandomInt(0,9);
    let orientation =  getRandomInt(0,1);
    if(orientation == VERTICAL){
        for(let i = 0; i < ship.length; i++){
            // check if it is possible to set a ship
            if(!isValidPos(field, x, y+i, orientation, i)){
                return false;
            }
        }
        // set the ship if it is possible
        for(let i = 0; i < ship.length; i++){
            field[x][y+i] = SHIP;
        }
        return true;
    }
    // HORIZONTAL
    else{
        for(let i = 0; i < ship.length; i++){
            // check if it is possible to set a ship
            if(!isValidPos(field, x+i, y, orientation, i)){
                return false;
            }
        }
        // set the ship if it is possible
        for(let i = 0; i < ship.length; i++){
            field[x+i][y] = SHIP;
        }
        return true;
    }
}

// checks if position is possible for a ship
function isValidPos(field,posX, posY, orientation, counter) {
    if(typeof field[posX] === "undefined" || typeof field[posX][posY] === "undefined"){
        return false;
    }
    if(!checkNextFields(field, posX, posY, orientation, counter)) {
        return false;
    }
    return true;
}

// checks all fields near the current field
function checkNextFields(field, x, y, orientation, counter) {
    if(orientation == VERTICAL){
        // the first field has to be checked other than all others
        if(counter == 0){
            // include a check of the left side of the ship
            return  checkField(field, x - 1, y - 1)&& // top left
              checkField(field, x, y - 1)&& // top
              checkField(field, x + 1, y - 1) && // top right
              checkField(field, x - 1, y) && // left
              checkField(field, x + 1 , y)&& // right
              checkField(field, x, y + 1); // bottom
        }else{
            return  checkField(field, x - 1, y) && // left
              checkField(field, x + 1, y) && // right
              checkField(field, x - 1, y + 1) && // bottom left
              checkField(field, x, y + 1) && // bottom
              checkField(field, x + 1, y + 1); // bottom right
        }
    }
    // HORIZONTAL
    else{
        // the first field has to be checked other than all others
        if(counter == 0){
            return  checkField(field, x - 1, y + 1)&& // bottom left
              checkField(field, x - 1, y)&& // left
              checkField(field, x - 1, y - 1)&& // top left
              checkField(field, x, y + 1)&& // bottom
              checkField(field, x, y - 1) && // top
              checkField(field, x + 1, y); // right
        } else{
            return  checkField(field, x, y - 1)&& // top
              checkField(field, x, y + 1)&& // bottom
              checkField(field, x + 1, y + 1)&& // bottom right
              checkField(field, x + 1, y)&& // right
              checkField(field, x + 1, y - 1); // top right
        }
    }
}

//check field an current position
function checkField(field, posX, posY) {
    if(typeof field[posX] === "undefined" || typeof field[posX][posY] === "undefined" || field[posX][posY] == WATER) {
        return true;
    }
    return false;
}

//---------------HELPER FUNCTION----------------------
// save the own player name
function saveName(){
    playerName = document.getElementById("player").value;
    socket.emit("saveName", {name: playerName});
    document.getElementById("headSp1").innerHTML = playerName;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
