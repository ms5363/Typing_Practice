// nav bar
const navs_a = document.querySelectorAll('.navs>a');
const navs = document.querySelectorAll('.navs');
const hrefsharp = document.querySelectorAll('a[href="#"]')

hrefsharp.forEach((elem) => elem.addEventListener('click',(e) => e.preventDefault()));


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








const hiddenInput = document.querySelector('.hiddenInput');
const data_description = document.querySelector('.data_description');
const resultDiv = document.querySelector('.result');
const resultDivCover = document.querySelector(".result .result_off");
const mainDiv = document.querySelector('.main_container');

const pageSpan = document.querySelector('.pageIndexDisplay');
const pageRange = document.querySelector('.currentPage input[type="range"]');
const pageInput = document.querySelector('.toPage form');
let upperChar = document.querySelectorAll('.upperChar');
let lowerChar = document.querySelectorAll('.lowerChar');

let text;
let allSentences;
let maxRow = 3;
let maxCharInRow =60;
let typeIndex = 0;
let wordWrapStartIndex = -1;
let wordWrapEndIndex = 0;

let allWordWrapIndex = [0];
let maxPage = 1;
let pageIndex = {page_custom:0};
let pageIndexProxy;
let currentCursorIndex = 0;

let timeForData = 0;
let startTimeForData;
let endTimeForData;
let setTimeoutForData;
let checkStopTime = 2000;


window.onload = init();


function init() {

    if (localStorage.InputText) {
        new Promise((resolve, reject) => resolve(localStorage.InputText))
            .then((data) => data.replace(/\r\n/gi, '\n'))
            .then((data) => text = data)
            .then((data) => allSentences = data.split(''))
            .then(() => main())
    }
    else {
        fetch('./J.d. Salinger - CatcherInTheRye.txt').then((response) => response.text())
            .then((data) => data.replace(/\r\n/gi, '\n'))
            .then((data) => text = data)
            .then((data) => allSentences = data.split(''))
            .then(() => main());
    }
}

function main() {

    // function randInt(min, max) {
    //     min = Math.ceil(min);
    //     max = Math.floor(max);
    //     return Math.floor(Math.random() * (max - min)) + min;
    // }







// pick all wordwrap
    // wordwrap algorithm
    function wordWrap() {
        // maxCharInRow + 1 ????????? text??? ????????? - (?????? ??? ???????????? ????????? ?????? ??? ????????? ??????????????? ??????)
        let currSentence = allSentences.slice(wordWrapStartIndex, wordWrapStartIndex + maxCharInRow + 1);
        let maxIndex = currSentence.length;
        // ?????? text??? maxCharInRow?????? ????????? index??? ????????? ????????????. ?????? text ??? maxIndex return
        if (maxIndex < maxCharInRow) {
            return wordWrapStartIndex + maxIndex;
        }

        // text??? ??????????????? ????????? ??????. ????????? ' '??? ????????? ?????? index ??? return.
        for (var c = 1; c <= maxIndex; c++) {
            if ((currSentence[maxIndex-c] === ' ') || (currSentence[maxIndex-c] === '\n')) {
                return wordWrapStartIndex + maxIndex - c;
            }
            else {
                continue;
            }
        }
        // ?????? ????????? ???????????? maxIndex??? return. ???????????? ??????????
        return maxIndex;
    }


    pageIndexProxy = new Proxy(pageIndex, {
        set: function(target, key, value) {
            value = Math.floor(value);
            if (target[key] == value) return;
            if (value < 1) value = 1
            else if (maxPage < value) value = maxPage;
            else target[key] = value;
            pageChanged(value);
            displaySentences(value);
            localStorage.setItem('page_custom', value)
        }
    });
    

    while (wordWrapEndIndex !== wordWrapStartIndex) {
        wordWrapStartIndex = wordWrapEndIndex;
        wordWrapEndIndex = wordWrap();
        allWordWrapIndex.push(wordWrapEndIndex);
    }

    maxPage = Math.max(1, Math.ceil(allWordWrapIndex.length / maxRow));
    pageRange.max = maxPage;

    if (localStorage.page_custom && localStorage.page_custom !== '0') 
        pageIndexProxy.page_custom = localStorage.page_custom;
    else pageIndexProxy.page_custom = 1;










// page change
    function pageChanged(newPage) {
        pageSpan.textContent = `${newPage}/${maxPage}`;
        pageRange.value = newPage;
    }


    pageInput.addEventListener('submit', (e) => {
        e.preventDefault();
        let inputArea = e.target.querySelector('input')

        pageIndexProxy.page_custom = inputArea.value;
        inputArea.value = null;
    });

    pageRange.addEventListener('change', (e) => {
        pageIndexProxy.page_custom = e.target.value
    })


    












// sentences display

    // wordWrap index??? ???????????? main_container??? ???????????? display.
    function displaySentences() {
        mainDiv.innerHTML = null;
        currentCursorIndex = 0;
        wordWrapStartIndex = allWordWrapIndex[(pageIndex.page_custom - 1) * maxRow];
        wordWrapEndIndex = allWordWrapIndex[(pageIndex.page_custom - 1) * maxRow + 1];
        
        for (var r = 0; r < maxRow; r++) {

            let upperRow = document.createElement('div');
            let lowerRow = document.createElement('div');
            
            upperRow.classList.add('upperRow', 'textRow');
            lowerRow.classList.add('lowerRow', 'textRow');
            mainDiv.appendChild(upperRow);
            mainDiv.appendChild(lowerRow);

            let rowLength = wordWrapEndIndex - wordWrapStartIndex;
            let sentence = allSentences.slice(wordWrapStartIndex, wordWrapEndIndex);

            for (var i = 0; i < rowLength; i++) {
                var upperChar_span = document.createElement('span');
                var lowerChar_span = document.createElement('span');
                upperChar_span.classList.add('upperChar');
                lowerChar_span.classList.add('lowerChar');
                lowerChar_span.classList.add('focused');
                if (sentence[i] == '\n') sentence[i] = '???'; 
                upperChar_span.textContent = sentence[i];
                lowerChar_span.textContent = ' ';
                upperRow.appendChild(upperChar_span);
                lowerRow.appendChild(lowerChar_span);
            }
            wordWrapStartIndex = wordWrapEndIndex;
            wordWrapEndIndex = allWordWrapIndex[allWordWrapIndex.indexOf(wordWrapEndIndex) + 1];
        }

        upperChar = document.querySelectorAll('.upperChar');
        lowerChar = document.querySelectorAll('.lowerChar');
        lowerChar[0].classList.add("current");
    }













// detect typing

    hiddenInput.addEventListener('input', (e) => keyInput(e));
    hiddenInput.addEventListener('keydown', (e) => keyDown(e));
    document.addEventListener('keyup', (e) => {if (e.key === 'Control') controlKeypressed = false});
    hiddenInput.addEventListener('focus', () => {lowerChar.forEach((elem, index) => {
        elem.classList.remove("focusout") 
        elem.classList.add("focused") 
        })
        lowerChar[currentCursorIndex].classList.add("current");
    });
    hiddenInput.addEventListener('focusout', () => {lowerChar.forEach((elem, index) => {
        elem.classList.remove("focused") 
        elem.classList.add("focusout") 
    })
    
        lowerChar[currentCursorIndex].classList.remove("current");
        console.log("test2")
    });

    mainDiv.addEventListener('click', (e) => {
        e.preventDefault();
        hiddenInput.focus()
    });

    let controlKeypressed = false;

    function keyDown(e) {
        startTimeCheck();
        if (e.key === 'Backspace') {
            if (currentCursorIndex === 0) return;
            currentCursorIndex--;
            lowerChar[currentCursorIndex].classList.remove('passed');
            lowerChar[currentCursorIndex].classList.remove('equal');
            lowerChar[currentCursorIndex + 1].classList.remove('current');
            lowerChar[currentCursorIndex].classList.add('current');
            lowerChar[currentCursorIndex].textContent = null;
        } 
        else if (e.key === 'Enter') {
            typeCompare('???');
            
            if (currentCursorIndex >= lowerChar.length) {
                endTimeCheck();
                pageIndexProxy.page_custom++;
                currentCursorIndex = 0;
            }
            
            else {
                lowerChar[currentCursorIndex].classList.add('current');
                lowerChar[currentCursorIndex - 1].classList.remove('current');
            }
        }
        
        else if (e.key === 'Control') {
            controlKeypressed = true;
        }
        
        else if (controlKeypressed && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
            if (e.key === 'ArrowLeft') pageIndexProxy.page_custom--;
            else pageIndexProxy.page_custom++;
            timeForData = 0;
            startTimeForData = 0;
        }
        
        else if (controlKeypressed && (e.key === 'ArrowUp')) {
            resultDivCover.setAttribute("style", "opacity: 0");
        }
        
        else if (controlKeypressed && (e.key === 'ArrowDown')) {
            resultDivCover.setAttribute("style", "opacity: 1");
        }
        
        else return;
    }
    
    
    function keyInput(e) {
        typeCompare(e.target.value);
        e.target.value = null;
        if (currentCursorIndex >= lowerChar.length) {
            endTimeCheck();
            pageIndexProxy.page_custom++
            currentCursorIndex = 0;
            return
        }
        lowerChar[currentCursorIndex].classList.add('current');
        lowerChar[currentCursorIndex - 1].classList.remove('current');
    }
    
    function typeCompare(inputChar) {
        let toTypeChar;

        toTypeChar = upperChar[currentCursorIndex].textContent

        lowerChar[currentCursorIndex].classList.add('passed');
        lowerChar[currentCursorIndex].textContent = inputChar;

        if (toTypeChar === inputChar) {
            lowerChar[currentCursorIndex].classList.add('equal')
        }
        currentCursorIndex++;
    }














// time & accuracy check

    function startTimeCheck() {
        if (!startTimeForData) startTimeForData = Date.now();
        
        clearTimeout(setTimeoutForData);
        data_description.textContent = 'Monitoring Typing Speed...';

        setTimeoutForData = setTimeout(() => {
            timeForData += Date.now() - startTimeForData;
            data_description.textContent = 'Monitoring Stopped';
            startTimeForData = null;
        }, checkStopTime);
    }
    
    function endTimeCheck() {
        timeForData += Date.now() - startTimeForData;

        var allUpperText = '';
        var allLowerText = '';
        var notEqual = 0;
        var accuracy;
        var cpm;
        var resultDivChilds = resultDiv.children;

        upperChar.forEach((node) => allUpperText += node.textContent);
        lowerChar.forEach((node) => allLowerText += node.textContent);

        for (var i = 0; i < allLowerText.length; i++) {
            if (allUpperText[i] !== allLowerText[i]) notEqual++;
        }

        accuracy = 100 * ((allLowerText.length - notEqual) / allLowerText.length);
        cpm = 60 * (allLowerText.length / (timeForData / 1000));

        resultDivChilds[0].textContent = `WPM : ${(cpm / 5).toFixed()}`;
        resultDivChilds[1].textContent = `CPM : ${cpm.toFixed()}`;
        resultDivChilds[2].textContent = `Accuracy : ${accuracy.toFixed(1)}%`;

        timeForData = 0;
        startTimeForData = 0;
        clearTimeout(setTimeoutForData);
    }

}