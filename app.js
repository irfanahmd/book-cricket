/*----- constants -----*/

// Player 1 Player 2
const pOne = 0
const pTwo = 1
const gameType = [176, 368, 640]
const books = ['LORD OF THE FLIES (176 PAGES)', 'A WILD SHEEP CHASE (368 PAGES)', 'HARRY POTTER AND THE GOBLET OF FIRE (640 PAGES)']
const lineup = ['3 BATSMEN (SHORT GAME)', '5 BATSMEN (LONGER GAME)']
const gameLength = [3, 5]

/*----- app's state (variables) -----*/

// Player 2 Turn
let pTwoTurn


let gameTypeIndex
let numBatsmenIndex
let pageNumber

/*----- cached element references -----*/

// pages, book, ball by ball display element, total runs & ball per batsman, total runs team, start/reset button

const cursor = $('.cursor')

const jumbotronDisplays = $('.jumbotron')

const startResetButton = $('.start-reset')
const gameTypeMenu = $('.game-type');
const numBatsmenMenu = $('.num-batsmen');




/*----- event listeners -----*/

//cursor
$('body').mousemove(function(e){
    cursor.css('top', (e.pageY - 10)).css('left', (e.pageX - 10))
})
$('body').click(function(e){
   cursor.addClass("expand");
    $('.cell:hover').css('background-color', 'yellowgreen');
    setTimeout(function(){
        cursor.removeClass("expand")
        $('.cell').css('background-color', 'lightgray')
    }, 500);
});

//game

gameTypeMenu.click(showSelectedBook)
numBatsmenMenu.click(showSelectedBatsmen)
startResetButton.click(init)

$('.grid').click(function(e){
    pageNumber = $('.page').text(e.target.className.split("-")[1]);
    
    switch (pageNumber.text() % 10) {
        case 8:    
        $('.score').text('quick single');
        break;
        case 6:    
        $('.score').text('SIX!!');
        break;
        case 4:
        $('.score').text('FOUR!');
        break;  
        case 2:    
        $('.score').text('two');
        break; 
        case 0:    
        $('.score').text('OUT');
        break;
    }

    $(this).css('pointer-events', 'none');
    $('body').css('cursor', 'not-allowed');
    
    setTimeout(function(){
        cursor.toggleClass('hide')
    }, 250);

    //change next ball color to red with the text hover for next ball

    $('.nextball').css('background-color', 'red').text('HOVER HERE FOR NEXT BALL')
})

$('.nextball').mouseover(function(){


    $('.nextball').css('background-color', 'greenyellow').text('READY')
    $('body').css('cursor', 'none');
    cursor.removeClass('hide')
    $('.grid').css('pointer-events', 'all');
  


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

    if($('.game-type-toggle').text() === "PICK A BOOK" | $('.num-batsmen-toggle').text() === "# OF BATSMEN"){
        
    }  else {
        $('.btn-success').removeAttr('disabled')
    }

    }



function init() {

    let buttontext = $(startResetButton).text();
    if (buttontext === "START GAME"){


        

        //start game

        //change text of visible button
        $(this).text("RESET GAME");
        
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
        generateDivs()

        //adjust book height
        $('.book').css('height', `${((gameType[gameTypeIndex]/2)*.75)+8}px`)

        //hide title image
        $('img').addClass('hide');

        
        //show hover space
        $('.nextball').removeClass('hide');

        //show scorecard
        $('table').removeClass('hide');


    } else {

        //reset game


        //change button text
        $(this).text("START GAME")


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

}

//div generator

function generateDivs() {
    for (i = 1; i < gameType[gameTypeIndex]; i++) {
    let num = i += 1;
    $('.grid').append(`<div class="cell cell-${num}"></div>`)
    }
}

