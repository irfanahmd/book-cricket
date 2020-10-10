/*----- constants -----*/

// Player 1 Player 2
const gameType = [640, 368, 176]
const books = ['HARRY POTTER AND THE GOBLET OF FIRE (640 PAGES)', 'A WILD SHEEP CHASE (368 PAGES)', 'LORD OF THE FLIES (176 PAGES)']
const lineup = ['3 (SHORT GAME)', '5 (LONGER GAME)']
const gameLength = [3, 5]

const stadium = new Audio()
stadium.src = 'sounds/Stadium Noise Loop.wav'
stadium.loop = true

const six = new Audio()
six.src = 'sounds/Six Audience.wav'

const bighit = new Audio()
bighit.src = 'sounds/Bat To Ball Fast Hit.wav'

const  mediumhit = new Audio()
mediumhit.src = 'sounds/Bat to Ball Normal Hit.wav'

const  smallhit = new Audio()
smallhit.src = 'sounds/Bat To Ball Slow Hit.wav'

const  out = new Audio()
out.src = 'sounds/Ball Hit To Ground.wav'

const  bowlerrun = new Audio()
bowlerrun.src = 'sounds/Bowler Running Audience Reaction.wav'




/*----- app's state (variables) -----*/

let playerOne

let ballScore = ''

let newRunningScore = [];

let newTotal = 0

let teamTotal = 0

let playerOneTotal = 0
let playerTwoTotal = 0

let wicketsLeft

const gameData = []

let currentBatsman


let gameTypeIndex
let numBatsmenIndex
let pageNumber


/*----- cached element references -----*/

// pages, book, ball by ball display element, total runs & ball per batsman, total runs team, start/reset button

const cursor = $('.cursor')

const jumbotronDisplays = $('.jumbotron')

const startButton = $('.start')

const resetButton = $('.reset')

const readyPlayerTwo = $('.ready-player2')

const gameTypeMenu = $('.game-type');
const numBatsmenMenu = $('.num-batsmen');

const pageGrid = $('.grid')

const teamTotalDisplay = $('#team-total')


/*----- event listeners -----*/

//cursor
$('body').mousemove(function(e){
    cursor.css('top', (e.pageY - 10)).css('left', (e.pageX - 10))
})

$('body').click(function(){
   cursor.addClass("expand");

    setTimeout(function(){
        cursor.removeClass("expand")
    }, 500);
});



//game

gameTypeMenu.click(showSelectedBook)
numBatsmenMenu.click(showSelectedBatsmen)
startButton.click(init)
resetButton.click(reset)
readyPlayerTwo.click(secondinnings)

pageGrid.click(ballOutcome);




//edge case 
pageGrid.parent().parent().click(ballOutcomeEdge)

function ballOutcomeEdge(e) {
    if (e.target === this) {

        //lose wicket
        $('.page').text('0');
        $('.score').html('HIT WICKET <p class="lead"> too close to the cover page or away from the pages </p>');
        ballScore = "W";
        bowlerrun.pause()
        bowlerrun.currentTime = 0
        out.play()
        bowlerrun.play()

        $('.grid').css('pointer-events', 'none');
        $('.book').css('pointer-events', 'all');
        $('body').css('cursor', 'not-allowed');
        $('.gridmom').attr('title', 'hover on the red square for the next ball')
    
        $('.book:hover').css('border-color', 'yellow');
    
        setTimeout(function(){
            $('.book').css('border-color', 'brown') 
        }, 250);
        
        setTimeout(function(){
            cursor.toggleClass('hide')      
        }, 250);
    
        //change next ball color to salmon with the text hover for next ball
    
        $('.nextball').css('background-color', 'salmon').css('border-color', 'salmon').text('HOVER HERE FOR NEXT BALL');
    
    
        

        wicketsLeft = wicketsLeft - 1

        currentBatsman.nameDOM.find("span").addClass('hide')

        //still need to push the ball

        if (wicketsLeft < 1) {

            // show total
            teamTotalDisplay.text(`${teamTotal}`)

            currentBatsman.nameDOM.find("span").addClass('hide')
            
            


            // remove hover here box
            $('.nextball').addClass('hide')
            $('.gridmom').removeAttr('title', 'hover on the red square for the next ball')

            // show ready player 2 button

            if(playerOne === true) {
                playerOneTotal = teamTotal
                readyPlayerTwo.removeClass("hide")
                setTimeout(function(){
                    P1teamName = $('#team-name-text').text()
                    $('.score').text(`${P1teamName} ALL OUT FOR ${playerOneTotal}`)
                }, 500)
            } 

            if(playerOne === false && playerTwoTotal < playerOneTotal) {
                $('#runchase-display').text(`${P1teamName} WON BY ${playerOneTotal-playerTwoTotal} RUN(S)`);
                setTimeout(function(){
                    setTimeout(function(){
                        $('.score').text(`${P1teamName} WINS`)
                    }, 500)
                })  
            }

            if(playerOne === false && playerTwoTotal === playerOneTotal) {
                $('#runchase-display').text(`NOTHING SEPARATES THE TWO TEAMS`);
                setTimeout(function(){
                    setTimeout(function(){
                        $('.score').text('MATCH TIED')
                    }, 500)
                    
                }) 
            }
            
            teamTotal = 0


        } else {
            teamTotalDisplay.text(`${teamTotal}-${gameLength[numBatsmenIndex]-wicketsLeft}`)
        }
        

        newRunningScore.push(ballScore)
        currentBatsman.runningScore = Object.assign([], newRunningScore)
        currentBatsman.runningScoreDOM.text(currentBatsman.runningScore.join(" "));

        currentBatsman.total = newTotal

        currentBatsman.totalDOM.text(`${currentBatsman.total} (${newRunningScore.length})`)

        currentBatsman.isOut = true;

        currentBatsman = gameData[`batsman${1+gameLength[numBatsmenIndex]-wicketsLeft}`];

        if(currentBatsman !== undefined) {
            currentBatsman.nameDOM.append('<span>*</span>')
        }
        
        newRunningScore = []
        newTotal = 0

    }
}

$('.nextball').mouseover(function() {
    refresh ()
    $('.page').text("---")
    $('.score').html('<p class = "lead" >click inside the book to play the next ball</p>');
})



$('.grid').mouseover(function(e) {
    $(e.target).css('background-image', 'linear-gradient(yellowgreen, greenyellow, white)');
    setTimeout(function(){
        $(e.target).css('background-image', 'linear-gradient(black, darkgrey, white, white)');  
    }, 500)
})


/*----- functions -----*/




function showSelectedBook(event) {
    $(this).parent().find('.btn').text($(event.target).text());
    //gameTypeIndex
    gameTypeIndex = books.indexOf($(event.target).text())

    if($('.game-type-toggle').text() === "PICK A BOOK" | $('.num-batsmen-toggle').text() === "# OF BATSMEN"){
        
    }  else {
        $('.btn-success').removeAttr('disabled')
    }
}

function showSelectedBatsmen(event){

    $(this).parent().find('.btn').text($(event.target).text());

    numBatsmenIndex = lineup.indexOf($(event.target).text())

    if($('.game-type-toggle').text() === "PICK A BOOK" || $('.num-batsmen-toggle').text() === "# OF BATSMEN"){
        
    }  else {
        $('.btn-success').removeAttr('disabled')
    }

    }



function init() {

    $('#team-name').html(`<td id="team-name-text" contenteditable="true">TEAM ONE</td><td><svg id="editButton" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
  </svg></td>`)

  $('#editButton').click(function(){
    $('#team-name-text').focus();
   });

   //put cursor at end


    // collapse how to play
    $('#collapseExample').removeClass("show")

    $('.how-to-play').addClass("hide")
    $('.game-info').addClass("hide")

    stadium.play()

    startButton.addClass("hide")

    resetButton.removeClass("hide")

    playerOne = true

    //start game
        
    //hide dropdowns
    gameTypeMenu.parent().addClass('hide');
    numBatsmenMenu.parent().addClass('hide');

    //show displays
    jumbotronDisplays.removeClass('hide');

    //show empty div
    $('.empty').removeClass('hide');

    //show book
    $('.book').removeClass('hide');

    //generate the pages
    $('.grid').empty()
    generateDivs()

    //setup the players
    setupBattingLineup()

    //adjust book height
    $('.book').css('height', `${((gameType[gameTypeIndex]/2)*.75)+8}px`)

    //hide title image
    $('img').addClass('hide');
        
    //show hover space
    $('.nextball').removeClass('hide');

    //show scorecard
    $('table:not(#runchase)').removeClass('hide');

    //show additional scorecard rows

    if(numBatsmenIndex === 1) {
        $('#num-4').removeClass('hide');
        $('#num-5').removeClass('hide');

    } else {
        $('#num-4').addClass('hide');
        $('#num-5').addClass('hide');
    }

    // current batsmen
    currentBatsman = gameData['batsman1']

    currentBatsman.nameDOM.append('<span>*</span>')

    // wickets left

    wicketsLeft = gameLength[numBatsmenIndex]

    //empty scorecard

    $('#b1innings').text('')
    $('#b2innings').text('')
    $('#b3innings').text('')
    $('#b4innings').text('')
    $('#b5innings').text('')

    $('#b1total').text('')
    $('#b2total').text('')
    $('#b3total').text('')
    $('#b4total').text('')
    $('#b5total').text('')
    teamTotalDisplay.text(`TOTAL RUNS`)
    $('.page').text('')

    // reset app state

    ballScore = ''

    newRunningScore = [];

    newTotal = 0

    teamTotal = 0

    //hover button in right state

    refresh()

    $('.score').html('<small class="display-4 score"> **PLAYER ONE** <p class="lead"> click inside the book to play the first ball </p></small>')

    $('.page').text('---')

}

function reset() {

    $('.how-to-play').removeClass("hide")

    $('.game-info').removeClass("hide")

    startButton.removeClass("hide")

    resetButton.addClass("hide")

    //remove dropdowns
    gameTypeMenu.parent().removeClass('hide');
    numBatsmenMenu.parent().removeClass('hide');
    
    //hide displays
    jumbotronDisplays.addClass('hide');
    $('.empty').addClass('hide');

    //hide book
    $('.book').addClass('hide');

    //hide empty div
    $('.empty').addClass('hide');

    //hide hover
    $('.nextball').addClass('hide')

    //hide table
    $('table').addClass('hide')

    //hide title image
    $('img').removeClass('hide');

    //empty divs
    $('.grid').empty()

    //remove ready player 2 button
    readyPlayerTwo.addClass("hide")


    //remove *
    currentBatsman.nameDOM.find("span").addClass('hide')


    //change team name

}

//div generator

function generateDivs() {
    for (i = 1; i < gameType[gameTypeIndex]; i++) {
    let num = i += 1;
    $('.grid').append(`<div class="cell cell-${num}"></div>`)
    }
}

function setupBattingLineup() {

    const initialBatsmanData = {
        runningScore: [],
        total: 0,
        isOut: false
    }

    count = gameLength[numBatsmenIndex];

    while(count !== 0) {

        gameData[`batsman${count}`] = Object.assign({}, initialBatsmanData)

        gameData[`batsman${count}`].runningScoreDOM = $(`#b${count}innings`)

        gameData[`batsman${count}`].totalDOM = $(`#b${count}total`)

        gameData[`batsman${count}`].nameDOM = $(`#b${count}name`)

        count --
    }

}

function ballOutcome(e){

    

    pageNumber = $('.page').text(e.target.className.split("-")[1]);
    
    switch (pageNumber.text() % 10) {
        case 8:    
        $('.score').text('quick single');
        ballScore = 1;
        smallhit.play()
        break;
        case 6:   
        $('.score').html('<img src="six.jpg" class="umpire-signal"/> SIX!!')
        ballScore = 6;
        bighit.play()
        six.pause()
        six.currentTime = 0
        six.play()
        break;
        case 4:
        $('.score').html('<img src="four.jpg" class="umpire-signal"/> FOUR!')
        ballScore = 4;
        bighit.play()
        six.pause()
        six.currentTime = 0
        six.play()
        break;  
        case 2:    
        $('.score').text('two');
        ballScore = 2;
        mediumhit.play()
        break; 
        case 0:    
        $('.score').html('<img src="out.jpg" class="umpire-signal"/> OUT!!')
        ballScore = "W";
        bowlerrun.pause()
        bowlerrun.currentTime = 0
        out.play()
        bowlerrun.play()
        break;
    }

    
    $(this).css('pointer-events', 'none');
    $('.book').css('pointer-events', 'all');
    $('body').css('cursor', 'not-allowed');
    $('.gridmom').attr('title', 'hover on the red square for the next ball')

    

    $('.cell:hover').css('background-image', 'linear-gradient(yellow, yellow)');

    setTimeout(function(){
        $('.cell').css('background-image', 'linear-gradient(black, darkgrey, white, white)') 
    }, 250);
    
    setTimeout(function(){
        cursor.toggleClass('hide')      
    }, 250);

    //change next ball color to salmon with the text hover for next ball

    $('.nextball').css('background-color', 'salmon').css('border-color', 'salmon').text('HOVER HERE FOR NEXT BALL');


    


    // record score in scorecard

    

    if(ballScore !== "W"){

        newRunningScore.push(ballScore)
        newTotal = newTotal + ballScore
        teamTotal = teamTotal + ballScore

        teamTotalDisplay.text(`${teamTotal}-${gameLength[numBatsmenIndex]-wicketsLeft}`)

        currentBatsman.runningScore = Object.assign([], newRunningScore)

        currentBatsman.runningScoreDOM.text(currentBatsman.runningScore.join(" "));

        currentBatsman.total = newTotal

        currentBatsman.totalDOM.text(`${currentBatsman.total} (${newRunningScore.length})`)

        

        if (playerOne === false) {
            playerTwoTotal = teamTotal;
            teamName = $('#team-name-text').text()
            $('#runchase-display').text(`${teamName} TRAILS BY ${playerOneTotal-playerTwoTotal} RUNS`);
        }

        if (playerOne === false && playerTwoTotal > playerOneTotal){
            teamName = $('#team-name-text').text()
            $('#runchase-display').text(`${teamName} WON BY ${wicketsLeft} WICKET(S)`);
            $('.nextball').addClass('hide')
            $('.gridmom').removeAttr('title', 'hover on the red square for the next ball')
            setTimeout(function(){
                
                $('.score').text(`${teamName} WINS`)
            }, 500)
            
        }

        if (playerOne === false && playerTwoTotal === playerOneTotal){
            teamName = $('#team-name-text').text()
            $('#runchase-display').text(`${teamName} NEEDS 1 RUN TO WIN`);
        }


    } else {


        //wicketsLeft
        wicketsLeft = wicketsLeft - 1

        currentBatsman.nameDOM.find("span").addClass('hide')

        //still need to push the ball

        

        if (wicketsLeft < 1) {

            // show total
            teamTotalDisplay.text(`${teamTotal}`)

            currentBatsman.nameDOM.find("span").addClass('hide')


            // remove hover here box
            $('.nextball').addClass('hide')
            $('.gridmom').removeAttr('title', 'hover on the red square for the next ball')

            // show ready player 2 button

            if(playerOne === true) {
                playerOneTotal = teamTotal
                readyPlayerTwo.removeClass("hide")
                setTimeout(function(){
                    P1teamName = $('#team-name-text').text()
                    $('.score').text(`${P1teamName} ALL OUT FOR ${playerOneTotal}`)
                }, 500)
            } 

            if(playerOne === false && playerTwoTotal < playerOneTotal) {
                $('#runchase-display').text(`${P1teamName} WON BY ${playerOneTotal-playerTwoTotal} RUN(S)`);
                setTimeout(function(){
                    $('.score').text(`${P1teamName} WINS`)
                }, 500)
                
            }

            if(playerOne === false && playerTwoTotal === playerOneTotal) {
                $('#runchase-display').text(`NOTHING SEPARATES THE TWO TEAMS`);
                setTimeout(function(){
                    $('.score').text('MATCH TIED')
                }, 500)
                
            }

            
            teamTotal = 0


        } else {
            teamTotalDisplay.text(`${teamTotal}-${gameLength[numBatsmenIndex]-wicketsLeft}`)
        }
        
        
        newRunningScore.push(ballScore)
        currentBatsman.runningScore = Object.assign([], newRunningScore)
        currentBatsman.runningScoreDOM.text(currentBatsman.runningScore.join(" "));

        currentBatsman.total = newTotal

        currentBatsman.totalDOM.text(`${currentBatsman.total} (${newRunningScore.length})`)

        currentBatsman.isOut = true;

        currentBatsman = gameData[`batsman${1+gameLength[numBatsmenIndex]-wicketsLeft}`];

        if(currentBatsman !== undefined) {
            currentBatsman.nameDOM.append('<span>*</span>')
        }

        newRunningScore = []
        newTotal = 0

    }

}

function secondinnings() {
    P1teamName = $('#team-name-text').text()
    init()
    playerOne = false
    $('#runchase').removeClass('hide');
    $('#runchase-display').text(`PLAYER TWO TRAILS BY ${playerOneTotal} RUNS`)
    readyPlayerTwo.addClass("hide")
    $('#team-name').html(`<td id="team-name-text" contenteditable="true">TEAM TWO</td><td><svg id="editButton" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
  </svg></td>`)

  $('#editButton').click(function(){
    $('#team-name-text').focus()
   });
    

    $('.score').html('<small class="display-4 score"> **PLAYER TWO** <p class="lead"> click inside the book to play the first ball </p></small>')
    
}
    
function refresh(){

    $('.nextball').css('background-color', 'yellowgreen').css('border-color', 'yellowgreen').text('READY!')
    $('body').css('cursor', 'none');
    cursor.removeClass('hide')
    $('.grid').css('pointer-events', 'all');
    $('.book').css('pointer-events', 'all');
    
    
    $('.gridmom').removeAttr('title', 'hover on the red square for next ball')
  
}

