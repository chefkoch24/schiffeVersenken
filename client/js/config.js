//-----------------------------CONSTANTS-------------------------------------
const apiURL = "http://localhost:3000/api/";
const HORIZONTAL = 1;
const VERTICAL = 0;
const ROWS = 10;
const COLUMNS = 10;
const WATER = 0;
const SHIP = 1;
const MISSED_SHOOT = -1;
const HIT = 2;
const myTable = document.getElementById("spielfeldEigen");
const opponentTable = document.getElementById("spielfeldGegner");
const tableHeadArray = ["#", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
