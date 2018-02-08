
//----------------------------MODALS--------------------------------------------


function showWinnerModal(winner){
    $("#WinnerModal").modal("show");
}

function showDisconnectedModal(){
    socket.on("disconnect", function(){
        $("#DisconnectedModal").modal("show");
    });
}

//----------------------------GAME LOGIC----------------------------------------

/*
	Ship placement

	Ships are placed from left to right, in detail from x to x + ship.length
	or from top to bottom, in detail from y to y + ship.length



	Field values / Field states


	introduced with placement phase

	0 := Empty field; occupyable by a new ship
	1 := Occupied field; not occupyable by a new ship

	introduced with battle phase

	-1 := Empty field that has been shot; Results from 0- or 1-fields being shot
	2 := Ship that has been shot; Results from 1-fields being shot
	*/
















// checks current field // check for what?




// set all ships randomly



//----------------------------GAME DISPLAY---------------------------------------
