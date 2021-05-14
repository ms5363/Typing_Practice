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













const form = document.querySelector('form');
const inputText = document.querySelector('form textarea');

inputText.textContent = localStorage.InputText;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(e);
    console.log(inputText.value);
    localStorage.InputText = inputText.value;
    localStorage.page_custom = 0;
})