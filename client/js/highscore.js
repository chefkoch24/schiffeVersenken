class Highscore{

// load the highscore with a REST-API
    getHighscore(){
        $.ajax({
  			method: "GET",
  			dataType: "JSON",
  			url: apiURL + "highscore"
  		}).done((msg, err) => {
            if(err === "success"){
                this.showHighscore(this.getBestScores(msg,5));
            }else {
                this.showHighscoreError();
            }
        });
    }

    // save the highscore with a REST-API
    setHighscore(playerName, shoots){
        $.ajax({
  			type: "POST",
  			data: JSON.stringify({
  				"name": playerName,
  				"score": shoots
  			}),
  			contentType: "application/json",
  			dataType: "JSON",
  			url: apiURL + "highscore",
  			success: alert("Highscore ist gespeichert")
        });
    }

    // get the best n scores
    getBestScores(highscores, nr) {
    // sort the lowest amount of points first
        highscores.sort(function(a,b){
            return a.score-b.score;
        });

        let bestScores = [];

        for(let i = 0; i < nr && i < highscores.length; i++){
            bestScores.push(highscores[i]);
        }
        return bestScores;
    }

    // render the highscore
    showHighscore(highscoreArray){
        let highscore = document.getElementById("Highscore");
        highscore.innerHTML = "";
        if(highscoreArray.length == 0) {
            highscore.innerHTML = "Kein Highscore verfügbar";
        }
        for(let i = 0; i < highscoreArray.length; i++){
            let score = document.createElement("p");
            score.innerHTML = i+1 + "." + highscoreArray[i].name + "  " + highscoreArray[i].score;
            let br = document.createElement("br");
            score.appendChild(br);
            highscore.appendChild(score);
        }
    }
    // render if it is not possible to get highscore data
    showHighscoreError(){
        let highscore = document.getElementById("Highscore");
        highscore.innerHTML = "Kein Highscore verfügbar";
    }
}
