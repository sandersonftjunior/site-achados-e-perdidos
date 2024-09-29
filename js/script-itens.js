const showForm = document.querySelector('#showForm')
const divForm = document.querySelector('.divForm');

function callForm() {
    divForm.classList.add('visible');
}

function hideForm(event) {
    if (!divForm.contains(event.target) && event.target !== showForm) {
        divForm.classList.remove('visible'); 
    }
}

showForm.addEventListener('click', callForm);

document.addEventListener('click', hideForm);