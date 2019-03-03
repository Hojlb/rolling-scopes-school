'use strict';

const generalPartPage = document.querySelector('.general');
const userForm = document.querySelectorAll('#userIdentification input');
const skirtCollection = document.querySelectorAll('.game-setings input');
const difficultyCollection = document.querySelectorAll('select option');
const startButton = document.querySelector('#startGameButton');
const gameGrid = document.querySelector('#gameGrid');
const gameField = document.querySelector('#gameField');
const minute = document.querySelector('#minute');
const second = document.querySelector('#second');
const resultsTable = document.querySelector('.results-table');

minute.innerText = "00";
second.innerText = "00";


let cardIsOpen = [];
let cardNumber = [];

let counterOfPairs;

// autocompleteForm();

let currentCardSkirtAddress = '';

function checkPageSettings() {
  let isChecked = false;
  userForm.forEach(item => {
    if (!item.value) {
      alert(`Fill in the form fields "${item.name}"`);
      isChecked = false;
    } else {
      isChecked = true;
    }
  });
  return isChecked;
};

function checkSelectedSkirt() {
  if (currentCardSkirtAddress === '') {
    alert(`Choise a Skirt!`);
    return false;
  } else {
    return true;
  };

};

function selectedDifficulty() {
  let difficulty;
  difficultyCollection.forEach(item => {
    if (item.selected) difficulty = item.value;
  })
  return difficulty;
}

function handlingStartButton() {
  if (!checkPageSettings() || !checkSelectedSkirt()) {
    throw "Did not choise a game settings or fill in the form fields";
  } else {

    let gridSize = selectedDifficulty();
    generalPartPage.style.display = 'none';
    gameField.style.display = 'block';

    createGameGrid(gridSize);
    startButton.setAttribute('disabled', true);

    timer.startGameTimer();
  }
};

function createGameGrid(gridSize) {
  let [amountColumns, amountRows] = gridSize.split('');
  let height = 190 * amountRows + (amountRows - 1) * 5;
  let width = 135 * amountColumns + (amountColumns - 1) * 5;

  gameGrid.style.maxHeight = `${height}px`;
  gameGrid.style.maxWidth = `${width}px`;
  gameGrid.style.gridTemplateColumns = `repeat(${amountColumns}, 1fr)`;
  gameGrid.style.gridTemplateRows = `repeat(${amountRows}, 1fr)`;

  createGridItem(amountColumns * amountRows, currentCardSkirtAddress);
}

function createGridItem(amountItem, img) {
  let numbArray = randomArray(amountItem);
  counterOfPairs = amountItem/2;
  for (let i = 0; i < amountItem; i++) {

    let item = document.createElement('div');
    item.id = i;
    item.className = 'item';
    item.innerHTML = `<div class="rotate">
        <img src="${img}" alt="">
        <p class="back" style="color: blue; font-size: 50px; font-weight: bold">${numbArray.pop()}</p> </div>`;

    gameGrid.appendChild(item);
    item.addEventListener('click', turnCard);

  };
};

function endGame() {
    gameField.style.display = 'none';

    let JSONResult = JSON.stringify( `${userForm[0].value} - ${timer.stopTimer()}` );

    //timer.cleaningTimer(); // for restart-game button
    if ( !localStorage.getItem('Highscore') ) {
      localStorage.setItem ("Highscore", JSONResult);
    } else {
      JSONResult = localStorage.getItem('Highscore') + "," + JSONResult;
      localStorage.setItem("Highscore", JSONResult );
    }

    printResult(JSONResult, resultsTable);

}

function printResult(textJSON, innerInner){
    innerInner.style.display = 'block';
    let olElement = innerInner.querySelector('ol');

    let textArray = textJSON;
    textArray = textArray.split(',');

    textArray.forEach(item => {
      let liElement = document.createElement('li');
      liElement.innerText = item;
      olElement.appendChild(liElement);
    });

}

function turnCard() {

  let element = this.querySelector('.rotate');
  controlTurnCards(element);

  //element.style.transform = 'rotateY(180deg)';
}

function controlTurnCards(card) {
  let number = +card.querySelector('.back').innerText;

  if (cardNumber.indexOf(number) === -1 && cardIsOpen.length < 2) {
    cardIsOpen.push(card);
    cardNumber.push(number);
  } else if (cardNumber.indexOf(number) !== -1 && cardIsOpen.length < 2) {
    card.classList.toggle('turn-card');
    cardIsOpen.push(card);
    cardNumber.push(number);
    cardIsOpen.forEach(item => item.classList.toggle('invisible-card'));

    counterOfPairs--;
    if(counterOfPairs === 0) endGame();

    return;
  } else {
    cardIsOpen.forEach(item => item.classList.toggle('turn-card'));
    cardIsOpen = [];
    cardNumber = [];
    cardIsOpen.push(card);
    cardNumber.push(number);
  }

  card.classList.toggle('turn-card');

  };

  function randomArray(amountItem) {
    let set = new Set();
    let result = [];
    for (let i = 0; set.size < amountItem / 2; i++) {
      let numb = Math.floor(Math.random() * 100);
      set.add(numb);
    }

    set.forEach(item => result.push(item, item));

    return result.sort((a, b) => Math.random() - 0.5).sort((a, b) => Math.random() - 0.5);
  };

  function handlingCardSkirtButton() {
    skirtCollection.forEach(item => {
      item.checked = false;
      item.style.outline = '';
    });

    this.checked = true;
    this.style.outline = '5px solid #aad925';

    switch (this.id) {
      case 'cardSkirt1':
        currentCardSkirtAddress = `img/Card_skirt/marvel_skirt.png`;
        break;

      case 'cardSkirt2':
        currentCardSkirtAddress = `img/Card_skirt/flower1_cr.png`;
        break;

      case 'cardSkirt3':
        currentCardSkirtAddress = `img/Card_skirt/minions_skirt_cr.png`;
        break;

      default:
        currentCardSkirtAddress = `url(../img/Card_skirt/minions_skirt_cr.png)`;

    };

    // let addressImage = getComputedStyle(this).backgroundImage.split('/');
    // addressImage = addressImage[addressImage.length - 1].split(')')[0];
    //
    // currentCardSkirtAddress = `url(../img/Card_skirt/${addressImage})`;
  };

  class Stopwatch {
    constructor(minuteArea, secondArea) {
      this.timerId;
      this.minuteArea = minuteArea;
      this.secondArea = secondArea;
    }

    cleaningTimer() {
      this.minuteArea.innerText = "00";
      this.secondArea.innerText = "00";
    }

    stopTimer() {
      clearInterval(this.timerId);
      return `${this.minuteArea.innerText}:${this.secondArea.innerText}`;
    }

    startGameTimer() {
      this.timerId = setInterval(function() {
        let seconds = +this.secondArea.innerText + 1;
        let minutes = +this.minuteArea.innerText;
        let time = this.conversionTime(minutes, seconds); // [min, sec]

        this.minuteArea.innerText = time[0];
        this.secondArea.innerText = time[1];

        //if( +this.secondArea.innerText === 5) console.log( this.stopTimer() );

      }.bind(this), 1000);
    };

    conversionTime(minutes, seconds) {
      let [min, sec] = [minutes + (seconds - seconds % 60) / 60, seconds % 60];

      if (sec < 10) {
        sec = `0${sec}`;
      }

      if (min < 10) min = `0${min}`;

      return [min, sec];
    }
  }; // <== end class Stopwatch

  // function heandlingTimerStartStop(e) {
  //   if(e.keyCode == '37' ){
  //     console.log( timer.stopTimer() ); //stop
  //
  //   } else if (e.keyCode == '39') {
  //     console.log( timer.startGameTimer() ); // continueTimer
  //
  //   } else if(e.keyCode == '40'){
  //     timer.cleaningTimer(); // restart timer
  //   }
  // };

  // TODO: the function autocompleteForm() is will be delete
  // function autocompleteForm() {
  //   userForm.forEach(item => item.value = 'autocomplete');
  // }


  let timer = new Stopwatch(minute, second);

  skirtCollection.forEach(item => item.addEventListener('click', handlingCardSkirtButton));

  startButton.addEventListener('click', handlingStartButton);

  // window.addEventListener('keydown', heandlingTimerStartStop)
