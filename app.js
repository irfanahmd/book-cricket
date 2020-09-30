/*----- constants -----*/

// Player 1 Player 2
const pOne = 0

const pTwo = 1




/*----- app's state (variables) -----*/

// Player 2 Turn
let pTwoTurn

/*----- cached element references -----*/

// pages, book, ball by ball display element, total runs & ball per batsman, total runs team, start/reset button
const bookElements = $('div.cell')
const book = $('#book')
const cursor = $('.cursor')

const displayBallByBallTextElement1 = $('tr#ballByBall-1')

const displayPlayerTotalTextElement1 = $('tr#batsmanOneTotal')

const startResetButton = $('.btn-success')


/*----- event listeners -----*/

$('body').mousemove(function(e){
    cursor.css('top', (e.pageY - 10)).css('left', (e.pageX - 10))
})


$('body').click(function(e){
   cursor.addClass("expand");
    setTimeout(function(){
        cursor.removeClass("expand")
    }, 500)
});


/*----- functions -----*/

function init() {
    $('.dropdown').addClass("hide");
}