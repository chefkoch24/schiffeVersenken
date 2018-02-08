const express = require("express");
const router = express.Router();
const fs = require("fs");


router.get("/", (req, res) => {
    // Read Highscores
    fs.readFile("routes/files/highscore.json", function(err, data){
        if(err) {
            console.log(err);
            res.send(err);
            return;
        }
        // Return Highscores
        res.status(200).json(JSON.parse(data));
    });
});

router.post("/", (req, res) => {
    console.log(req);
    // Read old Highscores
    fs.readFile("routes/files/highscore.json", function (err, data){
        if(err) {
            res.status(500);
            return;
        }
        let json = JSON.parse(data);

        console.log(json);
        // Add new Highscore
        json.push(
            {
                name: req.body.name,
                score: req.body.score
            }
        );

        console.log(json);

        // Write new Highscores
        fs.writeFile("routes/files/highscore.json", JSON.stringify(json), (err) => {
            if(err) {
                res.status(500);
                return;
            }
            res.status(201);
        });
    });

});

module.exports = router;
