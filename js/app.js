/*=============================================
=                Arrays                  =
=============================================*/

const cardIcons = [
    "fa fa-diamond",
    "fa fa-diamond",
    "fa fa-paper-plane-o",
    "fa fa-paper-plane-o",
    "fa fa-anchor",
    "fa fa-anchor",
    "fa fa-leaf",
    "fa fa-leaf",
    "fa fa-bicycle",
    "fa fa-bicycle",
    "fa fa-bomb",
    "fa fa-bomb",
    "fa fa-bolt",
    "fa fa-bolt",
    "fa fa-tree",
    "fa fa-tree"
];

let cardIconsUp = [];
let cardIconsMatched = [];



/*=============================================
=                  Timer                      =
=============================================*/

let interval;

let stopwatch = () => {

    let second = 0;

    let minute = 0;

    let watch = document.querySelector('#stopwatch');

    // runs this function once every 1000ms 
    interval = setInterval(() => {

        watch.innerHTML = `${minute} mins ${second} secs`;

        second++;

        // increments minute when seconds reach 60, sets seconds back to 0
        if (second === 60) {
            minute++;
            second = 0;
        }

        // increments hour when minutes gets to 60, sets minutes back to 0
        if (minute === 60) {
            hour++;
            minute = 0;
        }

    }, 1000);
};



/*=============================================
=           Generate the game board           =
=============================================*/

function setGame() {

    const deck = document.querySelector('.deck');

    /*== loop over array, for each element: ==*/
    cardIcons.forEach((_cardIcon, index) => {

        // create li element
        const card = document.createElement('li');

        // add .card class
        card.classList.add('card');

        // add icons
        card.innerHTML = `<i class='${cardIcons[index]}'></i>`;

        // append li class .card to parent ul .deck
        deck.appendChild(card);

        // attach event listener
        click(card);

        // sets stopwatch
        watch = document.querySelector('#stopwatch');
        watch.innerHTML = '0 mins 0 secs';
        clearInterval(interval);
    });
}



/*=============================================
=             Shuffle the cards               =
=============================================*/

/*== Shuffle function from http://stackoverflow.com/a/2450976 ==*/
function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}



/*=============================================
=                Click events                 =
=============================================*/

function click(card) {
    card.addEventListener('click', function (event) {

        const current = this;
        const previous = cardIconsUp[0];

        /* cardIconsUp array contains an element */
        if (cardIconsUp.length === 1) { // the array will be reset so that further matching pairs meet condition

            // .click2 class disables 2nd click
            card.classList.add('open', 'show', 'click2');


            cardIconsUp.push(this);

            // matching function
            cardIconsCompare(current, previous);

            /* cardIconsUp array contains no elements */
        } else {
            card.classList.add('open', 'show', 'click2');
            cardIconsUp.push(this);
        }
    });
}



/*=============================================
=        Card comparing and move counting     =
=============================================*/

function cardIconsCompare(current, previous) {

    /*== Compare cards ==*/

    // compares this. to previous innerHTML value
    if (current.innerHTML === previous.innerHTML) {

        // Cards Match - add .match class - lock cards up */
        current.classList.add('match');
        previous.classList.add('match');

        // push matched cards to matched array
        cardIconsMatched.push(current, previous);

        // resets the array so subsequent element pairs can be compared
        cardIconsUp = [];

        // check if the game is over
        done();

    } else {

        setTimeout(() => {

            /* Cards do not match - removes .open and .show classes - hides cards after 400ms delay */
            current.classList.remove('open', 'show', 'click2');
            previous.classList.remove('open', 'show', 'click2');

            cardIconsUp = [];

        }, 400); // <- TODO: add difficulty modes with reduced delay times in version 2.0
    }

    /*== Tally moves (2 card clicks = move) ==*/
    tallyMoves();
}



/*=============================================
=                   Moves                     =
=============================================*/

let moves = 0;

document.querySelector('.moves').innerHTML = 0;

function tallyMoves() {
    moves++;
    document.querySelector('.moves').innerHTML = moves;

    // calculate star rating with each move
    starRating();

    if (moves === 1) {

        second = 0;
        minute = 0;
        hour = 0;

        // run the timer upon move 
        stopwatch();
    }
}



/*=============================================
=                 Star rating                 =
=============================================*/

/*== Function gets called while counting moves ==*/
function starRating() {

    const bad = document.querySelector('#bad');
    const ok = document.querySelector('#ok');
    const good = document.querySelector('#good');

    // I elected to change class on stars rather than add star markup 
    switch (true) {

        case moves <= 16:
            bad.classList.add('purple');
            ok.classList.add('purple');
            good.classList.add('purple');
            break;

        case moves >= 17 && moves <= 20:
            bad.classList.add('purple');
            ok.classList.add('purple');
            good.classList.remove('purple'); // must remove .purple class to display fewer than 3 stars
            break;

        case moves > 20:
            bad.classList.add('purple');
            ok.classList.remove('purple');
            good.classList.remove('purple');
    }
}



/*=============================================
=              Play again function            =
=============================================*/

function playAgain() {
    document.getElementById('replay').addEventListener('click', () => {

        // clear deck
        document.querySelector('.deck').innerHTML = "";

        // re-generate game board
        setGame();

        // clear matched cards array 
        cardIconsMatched = [];

        // reset move counter
        moves = 0;
        document.querySelector('.moves').innerHTML = moves;

        // Remove star rating
        bad.classList.remove('purple');
        ok.classList.remove('purple');
        good.classList.remove('purple');

        // Reset timer
        let watch = document.querySelector('#stopwatch');
        watch.innerHTML = '0 mins 0 secs';
        clearInterval(interval);

        // Remove modal
        let removeModal = document.querySelector('#modal');
        removeModal.classList.remove('modal-open');
    });
}



/*=============================================
=                Game completed               =
=============================================*/

function done() {

    /*= Check if matched and cardIcons array lengths match =*/
    if (cardIconsMatched.length === cardIcons.length) {

        /*= calculate number of stars for modal message =*/
        let starNum = () => {
            if (moves <= 16) {
                num = 3;
            }
            else if (moves >= 17 && moves <= 20) {
                num = 2;
            }
            else if (moves > 20) {
                num = 1;
            }
        };

        // stops watch, gets final value
        clearInterval(interval);

        finalTime = watch.innerHTML;

        starNum();


        /*= generate the modal message =*/
        let modalMessage = () => {

            const modal = document.querySelector('.modal');

            // unhides the modal
            modal.classList.add('modal-open');


            let gameOverMessage = document.querySelector('#modal-message');


            if (moves > 20) {

                gameOverMessage.innerHTML = 'Game over, man! GAME OVER!';

            } else if (moves <= 20) {

                gameOverMessage.innerHTML = 'Victory, I guess. Could be worse.';
            }


            let modalSpan = document.querySelector('#modal-span');

            modalSpan.innerHTML = `${moves} moves in ${finalTime} is good for ${num} star(s) out of 3!`;

        };

        modalMessage();

        /*== Modal play again button ==*/
        document.getElementById('modal-play-again').addEventListener('click', () => {

            /*== stumped as to why calling playAgain() here is not working ==*/

            // clear deck
            document.querySelector('.deck').innerHTML = "";

            // re-generate game board
            setGame();

            // clear matched cards array 
            cardIconsMatched = [];

            // reset move counter
            moves = 0;
            document.querySelector('.moves').innerHTML = moves;

            // Remove star rating
            bad.classList.remove('purple');
            ok.classList.remove('purple');
            good.classList.remove('purple');

            // Reset timer
            let watch = document.querySelector('#stopwatch');
            watch.innerHTML = '0 mins 0 secs';
            clearInterval(interval);

            // Remove modal
            let removeModal = document.querySelector('#modal');
            removeModal.classList.remove('modal-open');
        });
    }
}



/*=============================================
=             function calls                  =
=============================================*/

// Shuffle
shuffle(cardIcons);

// First game
setGame();

// Play again
playAgain();


// set up the event listener for a card. If a card is clicked:
//  display the card's symbol (put this functionality in another function that you call from this one)
//  add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
//  if the list already has another card, check to see if the two cards match
//    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
//    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
//    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
//    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
