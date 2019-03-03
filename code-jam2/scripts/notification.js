const notifWrapper = document.querySelector('.notification-wrapper');
const isDisableTips = document.getElementById('tipsOf');
const buttonClose = document.querySelector('.button-close');

const buttonPreview = document.getElementById('arrowPrev');
const buttonNext = document.getElementById('arrowNext');
const iformWindow = document.querySelector('#iformWindow');
const informationButton = document.getElementsByName('information');

var currentIndexTip = getCurrentIndexOfTip();

let arrayTips = [
  '1. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',

  '2. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',

  '3. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',

  '4. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
];

function getCurrentIndexOfTip() {
  let indexTip;
  informationButton.forEach((item, i) => {
    if (item.checked) indexTip = i;
  });
  return indexTip;
}

function addTipOnBox(arrayTips, index) {
  iformWindow.innerHTML = arrayTips[index];
}

if (localStorage.getItem('isDisableTips') === 'true') {
  notifWrapper.style.display = 'none';

} else {
  setTimeout(function() {
    addTipOnBox(arrayTips, getCurrentIndexOfTip());
    notifWrapper.style.display = 'inline';
  }, 5000);
};

function closeNotification() {
  notifWrapper.style.display = 'none';
};

function disableTips() {
  if (isDisableTips.checked) {
    localStorage.setItem('isDisableTips', true);
  } else {
    localStorage.setItem('isDisableTips', false);
  }
};

/* This hack to designed for debug code, and it is to do switch on the tips window */

function onTips(e) {
  if (e.shiftKey && e.keyCode == '76') {
    localStorage.setItem('isDisableTips', false);
    alert('The localStorage item "isDisableTips" is changed to false');

    //for visualization
    document.querySelector('h1').style.color = 'red';
  }
};

function hotKeyForm(e) {
  if (e.keyCode == '27') {
    closeNotification();
  } else if (e.keyCode == '37') {
    previewTip();
  } else if (e.keyCode == '39') {
    nextTip();
  }
};

function previewTip() {
  informationButton[currentIndexTip].removeAttribute('checked');
  currentIndexTip--;
  checkInfoButton();
}

function nextTip() {
  informationButton[currentIndexTip].removeAttribute('checked');
  currentIndexTip++;
  checkInfoButton();
}

function checkInfoButton() {
  if (currentIndexTip < 0) {
    currentIndexTip = informationButton.length - 1;
  } else if (currentIndexTip > informationButton.length - 1) {
    currentIndexTip = 0;
  }

  informationButton[currentIndexTip].setAttribute('checked', true);
  addTipOnBox(arrayTips, currentIndexTip);
}

// function handlingRadioEvent(index){
//   informationButton[currentIndexTip].removeAttribute('checked');
//   currentIndexTip = index;
//   checkInfoButton();
// }

buttonClose.addEventListener('click', closeNotification);
isDisableTips.addEventListener('click', disableTips);
window.addEventListener('keypress', onTips);
window.addEventListener('keydown', hotKeyForm);
buttonPreview.addEventListener('click', previewTip);
buttonNext.addEventListener('click', nextTip);
//
// informationButton.forEach( (item, i) => item.addEventListener('click', handlingRadioEvent ));
