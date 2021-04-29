const hrefsharp = document.querySelectorAll('a[href="#"]')
hrefsharp.forEach((elem) => elem.addEventListener('click',(e) => e.preventDefault()));



const navs_a = document.querySelectorAll('.navs>a');
const navs = document.querySelectorAll('.navs');
const textInputDiv = document.querySelector('.textInput');
const wordToTypeDiv = document.querySelector('.wordToTypeDiv');
// const defaultBackgroundColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color')
const defaultBackgroundColor = window.getComputedStyle(wordToTypeDiv, null).getPropertyValue('background-color');

navs.forEach((nav) => nav.addEventListener('mouseenter', (e) => {
    e.target.classList.remove('open')
    e.target.classList.remove('openActive')
    clearTimeout();
    e.target.classList.add('open');
    navBackground(e, true);
    setTimeout(() => {
        e.target.classList.add('openActive')
    }, 150);
}));


navs.forEach((nav) => nav.addEventListener('mouseleave', (e) => {
    clearTimeout();
    e.target.classList.remove('openActive')
    setTimeout(() => {
        navBackground(e, false);
        e.target.classList.remove('open')
    }, 150);
}));


function navBackground(e, enter=false) {
    const background = e.target.querySelector('.navs_background');
    const navs_ul = e.target.querySelector('ul');
    const coords = navs_ul.getBoundingClientRect();
    console.log(coords);
    if (enter === true) {
        background.style.setProperty('width', `${coords.width}px`);
        background.style.setProperty('height', `${coords.height}px`);
        background.style.setProperty('top', `${coords.top}px`);
        background.style.setProperty('left', `${coords.left}px`);
    }
    else {
        background.style.setProperty('height', '0px');
    }
}





window.onload = init();
let words;

function init() {
    fetch('./EN_All_Words.txt').then((response) => response.text()).then((data) => words = data.split('\n')).then(() => main());
}

function main() {

    function randInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    let wordToType;
    let wordInput;

    function start() {
        textInputDiv.value = null;
        randIndex = randInt(0, words.length - 1);
        wordToTypeDiv.textContent = wordToType = words[randIndex];
    }

    textInputDiv.addEventListener('keypress', (e) => keyPress(e));

    function keyPress(e) {
        wordInput = e.target.value;
        if (e.keyCode === 13) {
            if (wordToType === textInputDiv.value) {
                wordToTypeDiv.style.backgroundColor = `rgb(131, 131, 171)`;
                console.log('test');
                start();
                setTimeout(() => (wordToTypeDiv.style.backgroundColor = defaultBackgroundColor), 150);
                return;
            }
            
            else {
                wordToTypeDiv.style.backgroundColor = `rgb(171, 130, 130)`;
                setTimeout(() => (wordToTypeDiv.style.backgroundColor = defaultBackgroundColor), 150);
            }
        }
    }
    start();

}