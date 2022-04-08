// JavaScript jQuery source code for Venn webpage


$(document).ready(function () {
    $('#game').hide();

    var livesLeft = 0; //How many lives the Frantic Survival player has left
    var countdown = 0; //How many seconds left on the Frantic Survival clock
    var counter = setInterval(timer, 1000); //How often to decrement the timer
    var levelCount = 1; //Which level the player is on in Challenge or Frantic Survival mode
    var levelSelector = 0; //Selects the level to start once the player completes the current level
    var Level; //The number of each square type in each circle of the game board

    //Decrements the timer every second until it hits zero
    function timer() {
        countdown--;
        if (countdown == 0) {
            clearInterval(counter);
            $('#game').html('<p class="game-over">Game Over</p><p class="game-over">You survived ' + (levelCount - 1) + ' stages</p>');

            $('#continue-button').prop('disabled', true);
            $('#fs-info').hide();
        }
        $('#timer').text(countdown);
    }

    //-------------------------------------Button Actions-----------------------------------------------

    /*When user clicks World 1, hide options and display the first level*/
    $('button#world-1-button').click(function () {
        setGame();
        levelSelect[1]();
    });

    //When user clicks World 2, hide options and display the 11th level
    $('button#world-2-button').click(function () {
        setGame();
        levelSelect[12]();
    });

    //When user clicks Challenge, hide options and begin by generating the first randomized level
    $('button#endless-button').click(function () {
        setGame();
        livesLeft = 1;
        levelSelect[101]();
    });

    //When user clicks Frantic Survival, hide options and begin by generating a randomized level
    $('button#time-attack-button').click(function () {
        setGame();
        livesLeft = 3;
        countdown = 5;
        $('#lives-left').text("Lives Left: " + livesLeft);
        $('#fs-info').show();
        levelSelect[102]();
    });

    //Sets up webpage for Game Display, removing main menu
    function setGame() {
        $('#world-1-button').hide();
        $('#world-2-button').hide();
        $('#endless-button').hide();
        $('#time-attack-button').hide();
        $('#game').show();
        $('#guide').hide();
        $('#continue-button').show();
        $('#home-button').show();
    }

    //-------------------------------------Objects-------------------------------------------------

    function Square(cost, canMove) {
        this.cost = cost;
        this.canMove = canMove;
    };

    //-----------------------------------Game Logic------------------------------------------------

    /*Create Level of Venn*/
    function createLevel(leftCircle, rightCircle) {
        var left = createCircle(leftCircle);
        var right = createCircle(rightCircle);
        Level = [left, right];
        displayGame();
    }

    //Create random Level of Venn by generating squares in legal pairs
    function createRandomLevel(mode) {
        //           HW,HB,SW,SB,WB,BW
        var rLeft = [0, 0, 0, 0, 0, 0];
        var rRight = [0, 0, 0, 0, 0, 0];

        //Determines how many pairs to make, 1-8, based on which mode and level the player is on
        if (mode) {
            numPairs = Math.floor((levelCount - 1) / 10) + 2;
        }
        else {
            numPairs = levelCount + 1;
        }
        
        var numLeftSq = 0;
        var numRightSq = 0;

        var validPairSq = [[false, false, true, false, true, true, false, true],//LHW
                           [false, false, false, true, true, true, true, false],//LHB
                           [true, false, false, false, true, true, true, false],//RHW
                           [false, true, false, false, true, true, false, true],//RHB
                           [true, true, true, true, true, true, true, true],    //SW
                           [true, true, true, true, true, true, true, true],    //SB
                           [false, true, true, false, true, true, false, true], //WB
                           [true, false, false, true, true, true, true, false]];//BW

        //Randomly chooses the first square of a pair, then chooses a legal pair for that square
        //Then, places each square in the proper circle
        while (numPairs > 0) {
            var sq1 = -1;
            var sq2 = -1;
            var validSq = false;
            var validPair = false;

            //Finds a legal first square to add to the board
            while (validSq == false) {
                sq1 = Math.floor(Math.random() * 8);
                //Prevents Hard Squares from being added to a side with 9 squares already in it
                //Also Prevents hard whites and hard blacks from being present on the same side
                validSq = !((numLeftSq == 9 && sq1 < 2) || (numRightSq == 9 && 1 < sq1 < 4) ||
                    (rLeft[0] > 0 && sq1 == 1) || (rLeft[1] > 0 && sq1 == 0) ||
                    (rRight[0] > 0 && sq1 == 3) || (rRight[1] > 0 && sq1 == 2));
            }

            validSq = false;
            //Finds a legal second square to pair with the first
            while (validPair == false || validSq == false) {
                sq2 = Math.floor(Math.random() * 8);

                validPair = validPairSq[sq1][sq2];
                validSq = !((numLeftSq == 9 && sq2 < 2) || (numRightSq == 9 && 1 < sq2 < 4) ||
                    (rLeft[0] > 0 && sq2 == 1) || (rLeft[1] > 0 && sq2 == 0) ||
                    (rRight[0] > 0 && sq2 == 3) || (rRight[1] > 0 && sq2 == 2));
            }

            //------------------------------------PLACE SQUARE 1-----------------------------------

            //Manually places hard squares into the correct side as determined by the table
            if (sq1 < 4) {
                if (sq1 == 0) {
                    rLeft[0]++;
                    numLeftSq++;
                }
                else if (sq1 == 1) {
                    rLeft[1]++;
                    numLeftSq++;
                }
                else if (sq1 == 2) {
                    rRight[0]++;
                    numRightSq++;
                }
                else {
                    rRight[1]++;
                    numRightSq++;
                }
            }
            else {
                //If one side already has 9 squares in it, place on the other side
                if (numRightSq == 9) {
                    rLeft[sq1 - 2]++;
                    numLeftSq++;
                }
                else if (numLeftSq == 9) {
                    rRight[sq1 - 2]++;
                    numRightSq++;
                }

                //Base case: Randomly select a side for the square to be placed in
                else {
                    var leftOrRight = Math.floor(Math.random() * 2);
                    if (leftOrRight == 0) {
                        rLeft[sq1 - 2]++;
                        numLeftSq++;
                    }
                    else {
                        rRight[sq1 - 2]++;
                        numRightSq++;
                    }
                }
            }

            //------------------------------------------PLACE SQUARE 2-----------------------------

            //Manually places hard squares into the correct side as determined by the table
            if (sq2 < 4) {
                if (sq2 == 0) {
                    rLeft[0]++;
                    numLeftSq++;
                }
                else if (sq2 == 1) {
                    rLeft[1]++;
                    numLeftSq++;
                }
                else if (sq2 == 2) {
                    rRight[0]++;
                    numRightSq++;
                }
                else {
                    rRight[1]++;
                    numRightSq++;
                }
            }
            else {
                //If one side already has 9 squares in it, place on the other side
                if (numRightSq == 9) {
                    rLeft[sq2 - 2]++;
                    numLeftSq++;
                }
                else if (numLeftSq == 9) {
                    rRight[sq2 - 2]++;
                    numRightSq++;
                }

                //Base case: Randomly select a side for the square to be placed in
                else {
                    var leftOrRight = Math.floor(Math.random() * 2);
                    if (leftOrRight == 0) {
                        rLeft[sq2 - 2]++;
                        numLeftSq++;
                    }
                    else {
                        rRight[sq2 - 2]++;
                        numRightSq++;
                    }
                }
            }  

            //-------------------------------------------------------------------------------------

            numPairs--;
        }

        
        var left = createRandomCircle(rLeft);
        var right = createRandomCircle(rRight);
        Level = [left, right];
        displayGame();
    }

    //Create a circle for a randomized level
    function createRandomCircle(circle, x) {
        var groupList = {
            "hardWhite": createGroup(circle[0], 1, 0),
            "softWhite": createGroup(circle[2], 1, 1),
            "hardBlack": createGroup(circle[1], -1, 0),
            "softBlack": createGroup(circle[3], -1, 1),
            "whiteBlack": createGroup(circle[4], 1, 1),
            "blackWhite": createGroup(circle[5], -1, 1)
        };
        return groupList;
    }

    //Create a circle within a level
    function createCircle(circle, x) {
        var groupList = {
            "hardWhite": createGroup(circle[0], 1, 0),
            "softWhite": createGroup(circle[1], 1, 1),
            "hardBlack": createGroup(circle[2], -1, 0),
            "softBlack": createGroup(circle[3], -1, 1),
            "whiteBlack": createGroup(circle[4], 1, 1),
            "blackWhite": createGroup(circle[5], -1, 1)
        };
        return groupList;
    }

    //Define and create the correct number of one type of square in a circle in a level
    function createGroup(numSquares, cost, canMove) {
        var squareList = [];
        for (i = 0; i < numSquares; i++) {
            var square = new Square(cost, canMove);
            squareList.push(square);
        }
        return squareList;
    }

    //Display the level in its initial state
    function displayGame() {

        for (var i = 0; i < 2; i++) {
            var chooseCircle = "";

            if (i == 0) {
                chooseCircle = "#left-circle";
            } else if (i == 1) {
                chooseCircle = "#right-circle";
            }
            $(chooseCircle).empty();

            for (var j in Level[i].hardWhite) {
                $(chooseCircle).append("<div class=\"square hard white\"></div>");
            }
            for (var j in Level[i].hardBlack) {
                $(chooseCircle).append("<div class=\"square hard black\"></div>");
            }
            for (var j in Level[i].softWhite) {
                $(chooseCircle).append("<div class=\"square soft white\"></div>");
            }
            for (var j in Level[i].softBlack) {
                $(chooseCircle).append("<div class=\"square soft black\"></div>");
            }
            for (var j in Level[i].whiteBlack) {
                $newSquare = $("<div class=\"square soft wb\"></div>");
                $newSquare.append("<div class=\"half-square white\"></div>");
                $newSquare.append("<div class=\"half-square black\"></div>");
                $(chooseCircle).append($newSquare);
            }
            for (var j in Level[i].blackWhite) {
                $newSquare = $("<div class=\"square soft bw\"></div>");
                $newSquare.append("<div class=\"half-square black\"></div>");
                $newSquare.append("<div class=\"half-square white\"></div>");
                $(chooseCircle).append($newSquare);
            }
        }

        //Fades the circles back onto the screen with the new level
        $(".circle").animate({
            opacity: "1"
        }, 300);

        $(".soft").click(function () {
            var $tempSquare = $(this).clone(true, true);
            var $circle = $(this).parent();
            var circleID = $circle.attr("id");

            var cl = this.classList;

            if (circleID == "left-circle" && $('#right-circle .square').length < 9) {

                $tempSquare.appendTo($("#right-circle"));
                this.remove();

                if (cl[2] == "black") {
                    var tempSquare = Level[0].softBlack.pop();
                    Level[1].softBlack.push(tempSquare);
                }
                else if (cl[2] == "white") {
                    var tempSquare = Level[0].softWhite.pop();
                    Level[1].softWhite.push(tempSquare);
                }
                else if (cl[2] == "wb") {
                    var tempSquare = Level[0].whiteBlack.pop();
                    Level[1].whiteBlack.push(tempSquare);
                }
                else if (cl[2] == "bw") {
                    var tempSquare = Level[0].blackWhite.pop();
                    Level[1].blackWhite.push(tempSquare);
                }
            }
            else if (circleID == "right-circle" && $('#left-circle .square').length < 9) {

                $tempSquare.appendTo($("#left-circle"));
                this.remove();

                if (cl[2] == "black") {
                    var tempSquare = Level[1].softBlack.pop();
                    Level[0].softBlack.push(tempSquare);
                }
                else if (cl[2] == "white") {
                    var tempSquare = Level[1].softWhite.pop();
                    Level[0].softWhite.push(tempSquare);
                }
                else if (cl[2] == "wb") {
                    var tempSquare = Level[1].whiteBlack.pop();
                    Level[0].whiteBlack.push(tempSquare);
                }
                else if (cl[2] == "bw") {
                    var tempSquare = Level[1].blackWhite.pop();
                    Level[0].blackWhite.push(tempSquare);
                }
            }
        });
    }

    //Waits for user input to move a square
    

    //Waits for user to click the Continue button, then checks thee game state as winning or losing
    $('button#continue-button').click(function () {

        //Calculates whether the game is won in current state by finding the total value of each circle
        var sumleftcircle = 0;
        var sumrightcircle = 0;
        var keySet = Object.keys(Level[0]);

        for (var i = 0; i < keySet.length; i++) {
            var key = keySet[i];
            for (var j = 0; j < Level[0][key].length; j++) {
                var sq = Level[0][key][j];
                if (typeof sq !== 'undefined') {
                    sumleftcircle += sq.cost;
                }
            }
            for (var j = 0; j < Level[1][key].length; j++) {
                var sq = Level[1][key][j];
                if (typeof sq !== 'undefined') {
                    if (key == "whiteBlack" || key == "blackWhite") {
                        sumrightcircle += (-1 * sq.cost);
                    }
                    else {
                        sumrightcircle += sq.cost;
                    }
                }
            }
        }

        //Run the next level if the user guesses correctly
        if (sumleftcircle == sumrightcircle) {
            //Animation for circles to fade back in
            $(".circle").css("opacity", "0");

            if (levelSelector > 100) {
                if ((levelSelector == 102 && levelCount == 70) || (levelSelector == 101 && levelCount == 7)) {
                    $('#game').html('<p class="game-over">You Win!</p><p class="game-over">You survived ' + levelCount + ' stages</p>');

                    $('#continue-button').prop('disabled', true);
                    $('#lives-left').hide();
                }
                else {
                    levelCount++;
                    levelSelect[levelSelector]();
                }
            }
            else {
                levelSelector++;
                levelSelect[levelSelector]();
            }
        }
        else {
            if (levelSelector > 100) {
                livesLeft--;
                if (livesLeft == 0) {
                    $('#game').html('<p class="game-over">Game Over</p><p class="game-over">You survived ' + (levelCount - 1) + ' stages</p>');

                    $('#continue-button').prop('disabled', true);
                    $('#fs-info').hide();
                }
                else {
                    $('#lives-left').text("Lives Left: " + livesLeft);
                }
            }
        }

    });
    

    //Levels------------------Order: Hard White, Soft White, Hard Black, Soft Black, White-Black, Black-White

    var levelSelect = {

        //Generates a level of Challenge Mode
        "101": function () {
            $('#level-text-2').text("Beat 7 stages of increasing difficulty to win. One wrong guess, and it's Game Over");
            $('#level-text-1').text("Stage " + levelCount);
            levelSelector = 101;
            createRandomLevel(false);
        },

        //Generates a level of Frantic Survival Mode
        "102": function () {

            //Set the timer at previously existing time, plus seconds added for completion bonus
            countdown = countdown + (Math.floor((levelCount - 1) / 10) + 1) * 5;
            levelSelector = 102;
            $('#timer').text(countdown);

            //Gain a life for a successful five levels
            if (levelCount % 5 == 1 && levelCount > 4) {
                livesLeft++;
                $('#lives-left').text("Lives Left: " + livesLeft);
            }

            //Determine the title of the current level and stage
            var stageCount = levelCount % 10;
            if (stageCount == 0) {
                stageCount = 10;
            }
            var stage = (Math.floor((levelCount - 1) / 10) + 1) + " Stage " + stageCount;

            $('#level-text-2').text("A wrong guess loses you a life. Run out of lives, and it's Game Over");
            $('#level-text-1').text("Level " + stage); 

            createRandomLevel(true);
        },

        //Start of World 1
        "1": function () {
            levelSelector = 1;
            $('#level-text-1').text("Stage 1");
            $('#level-text-2').text("Click on a square to move it from one circle to another. " +
                "If the circles aren't appearing next to each other, zoom out in your browser. Press continue with a winning board state to progress.");
            createLevel([0, 2, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]);
        },

        "2": function () {
            $('#level-text-1').text("Stage 2");
            $('#level-text-2').text("Click on a square to move it from one circle to another. " +
                "If the circles aren't appearing next to each other, zoom out in your browser.");
            createLevel([0, 4, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]);
        },

        "3": function() {
            $('#level-text-1').text("Stage 3");
            $('#level-text-2').text("Squares with borders cannot be moved");
            createLevel([2, 1, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0]);
        },

        "4": function () {
            $('#level-text-1').text("Stage 4");
            $('#level-text-2').text("Squares with borders cannot be moved");
            createLevel([0, 0, 1, 0, 0, 0], [0, 1, 0, 0, 0, 0]);
        },

        "5": function () {
            $('#level-text-1').text("Stage 5");
            $('#level-text-2').text("Squares with borders cannot be moved");
            createLevel([0, 0, 1, 1, 0, 0], [1, 1, 0, 0, 0, 0]);
        },

        "6": function () {
            $('#level-text-1').text("Stage 6");
            $('#level-text-2').text("Halfway done with World 1");
            createLevel([0, 1, 3, 0, 0, 0], [0, 1, 1, 0, 0, 0]);
        },

        "7": function () {
            $('#level-text-1').text("Stage 7");
            $('#level-text-2').text("Getting tougher");
            createLevel([0, 0, 0, 3, 0, 0], [1, 2, 0, 0, 0, 0]);
        },

        "8": function () {
            $('#level-text-1').text("Stage 8");
            $('#level-text-2').text("Getting tougher");
            createLevel([0, 0, 0, 5, 0, 0], [0, 1, 0, 0, 0, 0]);
        },

        "9": function () {
            $('#level-text-1').text("Stage 9");
            $('#level-text-2').text("Almost there");
            createLevel([0, 0, 2, 2, 0, 0], [1, 1, 0, 0, 0, 0]);
        },

        "10": function () {
            $('#level-text-1').text("Stage 10");
            $('#level-text-2').text("Final level of World 1");
            createLevel([0, 0, 3, 1, 0, 0], [0, 2, 1, 1, 0, 0]);
        },

        "11": function () {
            $('#level-text-1').text("You Win!");
            $('#level-text-2').text("Proceed to World 2 for a new mechanic");
            createLevel([9, 0, 0, 0, 0, 0], [0, 0, 9, 0, 0, 0]);
        },

        //Start of World 2
        "12": function () {
            levelSelector = 12;
            $('#level-text-1').text("Stage 1");
            $('#level-text-2').text("Say hello to the flip-floppers");
            createLevel([0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 0]);
        },

        "13": function () {
            $('#level-text-1').text("Stage 2");
            $('#level-text-2').text("Say hello to the flip-floppers");
            createLevel([0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 1, 0]);
        },

        "14": function () {
            $('#level-text-1').text("Stage 3");
            $('#level-text-2').text("Say hello to the flip-floppers");
            createLevel([0, 1, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0]);
        },

        "15": function () {
            $('#level-text-1').text("Stage 4");
            $('#level-text-2').text("I hope you are starting to get it...");
            createLevel([0, 1, 0, 0, 0, 1], [0, 2, 0, 0, 0, 0]);
        },

        "16": function () {
            $('#level-text-1').text("Stage 5");
            $('#level-text-2').text("...because...");
            createLevel([0, 0, 0, 1, 1, 0], [0, 0, 0, 2, 0, 0]);
        },

        "17": function () {
            $('#level-text-1').text("Stage 6");
            $('#level-text-2').text("...we're done holding back");
            createLevel([0, 0, 1, 0, 1, 0], [1, 1, 0, 0, 0, 0]);
        },

        "18": function () {
            $('#level-text-1').text("Stage 7");
            $('#level-text-2').text("World 1 and World 2 are actually just lessons");
            createLevel([0, 0, 2, 1, 0, 1], [0, 0, 0, 0, 2, 0]);
        },

        "19": function () {
            $('#level-text-1').text("Stage 8");
            $('#level-text-2').text("Go play Survival mode, if you dare");
            createLevel([0, 0, 0, 1, 2, 1], [2, 0, 0, 0, 0, 0]);
        },

        "20": function () {
            $('#level-text-1').text("Stage 9");
            $('#level-text-2').text("Put your puzzle solving skills to the test");
            createLevel([0, 0, 6, 0, 0, 0], [0, 1, 0, 0, 5, 0]);
        },

        "21": function () {
            $('#level-text-1').text("Stage 10");
            $('#level-text-2').text("But first, here is the final level of World 2");
            createLevel([1, 0, 0, 0, 0, 4], [0, 8, 0, 0, 1, 0]);
        },

        "22": function () {
            $('#level-text-1').text("You Win!");
            $('#level-text-2').text("Proceed to Challenge mode for 7 levels of escalating difficulty, or if you're ready, Frantic Survival");
            createLevel([0, 0, 0, 0, 9, 0], [0, 0, 0, 0, 0, 9]);
        }
    };

});
