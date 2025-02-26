"use strict";   //forces declaration of the scope of names

//Game is a constructor for a game board. 
//A game has a rectangular arrary of crateweights and a location for the bobcat that pushes them around.
//            it has methods move(dir)  to move the bobcat around,
//                            toString to show the gameboard as formatted text

//this version requires execution in an html file containing a div with id "myText" for displaying 
let Game = function () {  //THIS IS A CONSTRUCTOR FOR A GAME OBJECT it must be called us new
    //private game data
    let n = parseInt(Math.random() * 5) + 8;     //number of rows and columns    
    let b = [];      //initb (below) initializes to random weights and n x n
    let bob = {};    //the bob has a row,column, and direction (use 0=North,1=E,2=S,3=W)
    let tgt = {}; //creates the target crate
    let score = 0; //creates a score for the game
    let door = {};



    bob.r = n - 1;
    bob.c = parseInt(Math.random() * n);
    bob.d = 0;
    tgt.r = parseInt(Math.random() * (n - 2)) + 1; //defines the range bob must stay in
    tgt.c = parseInt(Math.random() * (n - 2)) + 1; //defines the range bob must stay in
    let wtprob = [.5, .75, .875];
    door.r = bob.r; //gives the door the initial value of bob
    door.c = bob.c; //gives the door the initial value of bob


    for (let r = 0; r < n; r++) {
        b[r] = [];
        for (let c = 0; c < n; c++) {
            let rnd = Math.random();
            if (rnd < wtprob[0])
                b[r][c] = 0;
            else if (rnd < wtprob[1])
                b[r][c] = 1;
            else if (rnd < wtprob[2])
                b[r][c] = 2;
            else
                b[r][c] = 3;

        }
    }
    b[tgt.r][tgt.c] = b[tgt.r][tgt.c] + 5; //makes a random target with adding 5 to the weight
    b[bob.r][bob.c] = 0;            //bob cannot start ontop of a crate

    



    //=====================================================================================

    // ===========  public methods  =================
    //Game.prototype.move = function (dirch){   is an alternative approach for a public method

    let inBounds = function (tempR, tempC) {
        return 0 <= tempR && tempR < n && 0 <= tempC && tempC < n; //keeps bob from going outside the range

    };

    window.addEventListener("keydown", function (e) { //prevents the arrow keys from scrolling while on the game page. (use the arrow keys to play the game)
        if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);

    this.move = function (dirch) {
        //dirch is converted to  0123 meaning NESW 
        let d = -1;

        if (dirch === 38)
            d = 0; //up arrow
        if (dirch === 37)
            d = 3;  //left arrow
        if (dirch === 40)
            d = 2;   //down arrow
        if (dirch === 39)
            d = 1; //right arrow
        if (dirch === 32) // 32 is the number for the space bar as 87,65 for w,a
            d = bob.d;
        if (d < 0)
            return;       //ignore bad keys

        let dr = [-1, 0, 1, 0];    //nesw
        let dc = [0, 1, 0, -1];
        let tempR = bob.r + dr[d]; //this is the next spot bob moves to 
        let tempC = bob.c + dc[d]; //this is the next spot bob moves to 




        if (dirch === 32) {
            if (inBounds(tempR, tempC)) { //finds the crate in bounds
                b[tempR][tempC] = 0; //explodes the crate (turns the value to zero)
                score = score + 100; // adds 100 to your score
                //img.src = 'images/explosion.png';

            }
            
            



        } else if (d === bob.d) {   //move the bob one cell in its direction

            if (inBounds(tempR, tempC) && slide(d)) {
                bob.r += dr[d]; //bobs current row location 
                bob.c += dc[d]; //bobs current column location 

                if (b[door.r][door.c] >= 5)
                    alert("GAME COMPLETE! Score: " + score);
            }
            

        } else if (d !== (bob.d + 2) % 4) {  //makes bob turn by a 90 degree pivot
            bob.d = d;
        }
        score++; //adds to your score each time you move
    };

    this.getScore = function () {
        return score;
    };


    let slide = function (d) {
        let allowedwt = 4;
        let dr = [-1, 0, 1, 0], dc = [0, 1, 0, -1];

        let i, rr, cc;
        let wt = 0;
        for (i = 1; true; i++) {
            rr = bob.r + i * dr[d]; //distance away from bob in card direction
            cc = bob.c + i * dc[d];
            let current = b[rr][cc];
            if (b[rr][cc] >= 5) {
                current = 0;

            }
            if (!inBounds(rr, cc) || wt + current >= allowedwt)
                return false;
            if (b[rr][cc] === 0)
                break;
            wt = wt + current;


        }

        for (let j = 0; j < i; j++) {
            let rprev = rr - dr[d];
            let cprev = cc - dc[d];
            b[rr][cc] = b[rprev][cprev];
            if (b[rr][cc] >= 5) {
                tgt.r = rr;
                tgt.c = cc;
            }
            rr = rprev;
            cc = cprev;

        }

        return true;

    };

    Game.prototype.Draw = function () {
        var tbl = document.createElement("table");
        for (let r = 0; r < n; r++) {

            var row = tbl.insertRow(r);




            for (let c = 0; c < n; c++) {
                var img = document.createElement('img');
                var cell1 = row.insertCell(c);
                img.setAttribute('display', 'block');

                if (r === bob.r && c === bob.c) {
                    img.src = 'images/bobcat.jpeg';
                    img.setAttribute('style', 'transform:rotate(' + bob.d * 90 + 'deg)');
                } else if (r === tgt.r && c === tgt.c) {
                    img.src = 'images/tC.png';

                } else if (r === door.r && c === door.c) {
                    img.src = 'images/door.png';

                }else if (b[r][c] === 0) {
                    //img.src = "images/crate2.png";
                    img.src = 'images/floor.jpeg';
                } else if (b[r][c] === 1) {
                    //img.src = "images/crate2.png";
                    img.src = 'images/one.jpeg';
                } else if (b[r][c] === 2) {
                    //img.src = "images/crate2.png";
                    img.src = 'images/two.jpeg';
                } else if (b[r][c] === 3) {
                    //img.src = "images/crate2.png";
                    img.src = 'images/three.jpeg';
                }

                img.setAttribute('height', '40');
                img.setAttribute('width', '40');
                cell1.appendChild(img);

            }
        }
        document.getElementById("drawView").innerHTML = "";
        document.getElementById('drawView').appendChild(tbl);
    };

    Game.prototype.toString = function () {  //public method of Game
        let out = "";
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                if (r === bob.r && c === bob.c) {
                    if (bob.d === 0)
                        out = out + "^";
                    else if (bob.d === 1)
                        out = out + ">";
                    else if (bob.d === 2)
                        out = out + "v";
                    else
                        out = out + "<";

                } else if (r === door.r && c === door.c) // bob's initial value stays open
                    out = out + " ";
                else
                    out = out + b[r][c];

            }
            out = out + "\n";
        }
        return "<pre>" + out + "</pre>";   //avoid browser formatting
    };
};       //=========== end Game ================


//=======================================================================
let viewText = function (brd) {   //show in existing div myText    
    let inner = "<h1>" + brd + "</h1>";
    //document.getElementById("myText").innerHTML = inner; //calls the text of the game from the  html file ALERT ALERT ALERTTT
    document.getElementById("score").innerHTML = "Score: " + brd.getScore(); //calls id "score" from the html file


};

window.onload = function () {     //called when the window has finished loading
    console.log("onload");
    let brd = new Game();       //random seeding

    document.onkeydown = function (ev) {  //keydown event  
        console.log("down ");
        let key = ev.keyCode;
        brd.move(key);
        viewText(brd);
        brd.Draw();
    };
    viewText(brd);
    brd.Draw();
};