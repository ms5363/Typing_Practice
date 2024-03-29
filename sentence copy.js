const hrefsharp = document.querySelectorAll('a[href="#"]')
hrefsharp.forEach((elem) => elem.addEventListener('click',(e) => e.preventDefault()));


const navs_a = document.querySelectorAll('.navs>a');
const navs = document.querySelectorAll('.navs');
// const textInputDiv = document.querySelector('.textInput');
// const wordToTypeDiv = document.querySelector('.wordToTypeDiv');
// const defaultBackgroundColor = window.getComputedStyle(wordToTypeDiv, null).getPropertyValue('background-color');
const mainDiv = document.querySelector('.main_container');

const hiddenInput = document.querySelector('.hiddenInput');

let upperChar = document.querySelectorAll('.upperChar');
let lowerChar = document.querySelectorAll('.lowerChar');


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
let text;
let allSentences;
let maxRow = 3;
let maxCharInRow =60;
let typeIndex = 0;
let wordWrapStartIndex = 0;
let wordWrapEndIndex;


function init() {
    fetch('./J.d. Salinger - CatcherInTheRye.txt').then((response) => response.text())
        .then((data) => data.replace(/\r\n/gi, '\n'))
        .then((data) => text = data)
        .then((data) => allSentences = data.split(''))
        .then(() => main());
}

function main() {

    // function randInt(min, max) {
    //     min = Math.ceil(min);
    //     max = Math.floor(max);
    //     return Math.floor(Math.random() * (max - min)) + min;
    // }



// sentences display
    // wordwrap algorithm
    function wordWrap() {
        // maxCharInRow + 1 값까지 text를 자른다 - (다음 줄 첫번째에 공백이 있을 때 단어가 내려가는것 방지)
        let currSentence = allSentences.slice(wordWrapStartIndex, wordWrapStartIndex + maxCharInRow + 1);
        let maxIndex = currSentence.length;
        // 잘린 text가 maxCharInRow보다 짧으면 index가 끝까지 왔다는것. 잘린 text 의 maxIndex return
        if (maxIndex < maxCharInRow) {
            return wordWrapStartIndex + maxIndex;
        }

        // text를 뒤에서부터 하나씩 검사. 최초로 ' '이 나오면 해당 index 값 return.
        for (var c = 1; c <= maxIndex; c++) {
            if (currSentence[maxIndex-c] === ' ') {
                return wordWrapStartIndex + maxIndex - c;
            }
            else {
                continue;
            }
        }
        
        // 아무 결과도 안나오면 maxIndex값 return. 사용될일 없을듯..
        return maxIndex;
    }





    // wordWrap index를 확인해서 main_container에 한줄한줄 display.
    function displaySentences() {
        mainDiv.innerHTML = null;

        for (var r = 0; r < maxRow; r++) {

            wordWrapEndIndex = wordWrap();

            let upperRow = document.createElement('div');
            let lowerRow = document.createElement('div');
            
            upperRow.classList.add('upperRow', 'textRow');
            lowerRow.classList.add('lowerRow', 'textRow');
            mainDiv.appendChild(upperRow);
            mainDiv.appendChild(lowerRow);

            let rowLength = wordWrapEndIndex - wordWrapStartIndex;

            let sentence = allSentences.slice(wordWrapStartIndex, wordWrapEndIndex);

            for (var i = 0; i < rowLength; i++) {
                let upperChar = document.createElement('span');
                let lowerChar = document.createElement('span');
                upperChar.classList.add('upperChar');
                lowerChar.classList.add('lowerChar');
                if (sentence[i] == '\n') sentence[i] = '⏎'; 
                upperChar.textContent = sentence[i];
                lowerChar.textContent = ' ';
                upperRow.appendChild(upperChar);
                lowerRow.appendChild(lowerChar);
            }
            wordWrapStartIndex = wordWrapEndIndex;
        }

        upperChar = document.querySelectorAll('.upperChar');
        lowerChar = document.querySelectorAll('.lowerChar');
    }
    displaySentences();



// typing detect

    let currentCursorIndex = 0;
    let toTypeChar;


    hiddenInput.addEventListener('input', (e) => keyInput(e));
    hiddenInput.addEventListener('keydown', (e) => keyDown(e));

    mainDiv.addEventListener('click', (e) => {
        e.preventDefault();
        hiddenInput.focus()
    });

    function keyDown(e) {
        if (e.keyCode === 8) {
            if (currentCursorIndex === 0) return;
            currentCursorIndex--;
            lowerChar[currentCursorIndex].classList.remove('passed');
            lowerChar[currentCursorIndex].classList.remove('equal');
            lowerChar[currentCursorIndex].textContent = null;
        } else if (e.keyCode === 13) {
            typeCompare('⏎');
        } else return;
    }
    
    
    function keyInput(e) {
        typeCompare(e.target.value);
        e.target.value = null;
        if (currentCursorIndex === lowerChar.length) {
            displaySentences();
            currentCursorIndex = 0;
        }
    }

    function typeCompare(inputChar) {
        toTypeChar = upperChar[currentCursorIndex].textContent

        lowerChar[currentCursorIndex].classList.add('passed');
        lowerChar[currentCursorIndex].textContent = inputChar;

        if (toTypeChar === inputChar) {
            lowerChar[currentCursorIndex].classList.add('equal')
        }

        currentCursorIndex++;
    }




}