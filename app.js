/*----- constants -----*/

// Player 1 Player 2
const gameType = [640, 368, 176]
const books = ['HARRY POTTER AND THE GOBLET OF FIRE (640 PAGES)', 'A WILD SHEEP CHASE (368 PAGES)', 'LORD OF THE FLIES (176 PAGES)']
const lineup = ['3 (SHORT GAME)', '5 (LONGER GAME)']
const gameLength = [3, 5]



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
        $('.score').html('HIT WICKET <p class="lead"> too close to the book cover </p>');
        ballScore = "W";

        $('.grid').css('pointer-events', 'none');
        $('.book').css('pointer-events', 'none');
        $('body').css('cursor', 'not-allowed');
    
        $('.book:hover').css('border-color', 'yellow');
    
        setTimeout(function(){
            $('.book').css('border-color', 'brown') 
        }, 250);
        
        setTimeout(function(){
            cursor.toggleClass('hide')      
        }, 250);
    
        //change next ball color to salmon with the text hover for next ball
    
        $('.nextball').css('background-color', 'salmon').css('border-color', 'salmon').text('HOVER HERE FOR NEXT BALL');
    
    
        $('.gridmom').attr('title', 'hover on the red square for next ball')

        wicketsLeft = wicketsLeft - 1

        //still need to push the ball

        if (wicketsLeft < 1) {

            // show total
            teamTotalDisplay.text(`${teamTotal}`)
            
            


            // remove hover here box
            $('.nextball').addClass('hide')
            $('.nextball').addClass('hide')

            // show ready player 2 button

            if(playerOne === true) {
                playerOneTotal = teamTotal
                readyPlayerTwo.removeClass("hide")
            } 

            if(playerOne === false && playerTwoTotal < playerOneTotal) {
                $('#runchase-display').text(`PLAYER ONE WINS BY ${playerOneTotal-playerTwoTotal} RUN(S)`);
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

        newRunningScore = []
        newTotal = 0

    }
}

$('.nextball').mouseover(function() {
    refresh ()
    pageNumber.text("---")
    $('.score').html('<p class = "lead" >click inside the book to play the next ball</p>');
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

}

function reset() {

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

        count --
    }

}

function ballOutcome(e){
    pageNumber = $('.page').text(e.target.className.split("-")[1]);
    
    switch (pageNumber.text() % 10) {
        case 8:    
        $('.score').text('quick single');
        ballScore = 1;
        break;
        case 6:   
        $('.score').html('<img src="six.jpg" class="umpire-signal"/> SIX!!')
        ballScore = 6;
        break;
        case 4:
        $('.score').html('<img src="four.jpg" class="umpire-signal"/> FOUR!')
        ballScore = 4;
        break;  
        case 2:    
        $('.score').text('two');
        ballScore = 2;
        break; 
        case 0:    
        $('.score').html('<img src="out.jpg" class="umpire-signal"/> OUT!!')
        ballScore = "W";
        break;
    }

    $(this).css('pointer-events', 'none');
    $('.book').css('pointer-events', 'none');
    $('body').css('cursor', 'not-allowed');

    $('.cell:hover').css('background-color', 'yellow');

    setTimeout(function(){
        $('.cell').css('background-color', '#949494') 
    }, 250);
    
    setTimeout(function(){
        cursor.toggleClass('hide')      
    }, 250);

    //change next ball color to salmon with the text hover for next ball

    $('.nextball').css('background-color', 'salmon').css('border-color', 'salmon').text('HOVER HERE FOR NEXT BALL');


    $('.gridmom').attr('title', 'hover on the red square for next ball')


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
            $('#runchase-display').text(`PLAYER TWO TRAILS BY ${playerOneTotal-playerTwoTotal} RUNS`);
        }

        if (playerOne === false && playerTwoTotal > playerOneTotal){
            $('#runchase-display').text(`PLAYER TWO WINS BY ${wicketsLeft} WICKET(S)`);
            $('.nextball').addClass('hide')
            $('.nextball').addClass('hide')

        }

    } else {


        //wicketsLeft
        wicketsLeft = wicketsLeft - 1

        //still need to push the ball

        if (wicketsLeft < 1) {

            // show total
            teamTotalDisplay.text(`${teamTotal}`)
            
            


            // remove hover here box
            $('.nextball').addClass('hide')
            $('.nextball').addClass('hide')

            // show ready player 2 button

            if(playerOne === true) {
                playerOneTotal = teamTotal
                readyPlayerTwo.removeClass("hide")
            } 

            if(playerOne === false && playerTwoTotal < playerOneTotal) {
                $('#runchase-display').text(`PLAYER ONE WINS BY ${playerOneTotal-playerTwoTotal} RUN(S)`);
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

        newRunningScore = []
        newTotal = 0

    }

}

function secondinnings() {
    console.log("second innings")
    init()
    playerOne = false
    $('#runchase').removeClass('hide');
    $('#runchase-display').text(`PLAYER TWO TRAILS BY ${playerOneTotal} RUNS`)
    readyPlayerTwo.addClass("hide")
    $('#team-name').text('TEAM TWO')

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

