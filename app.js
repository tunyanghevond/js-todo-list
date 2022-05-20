// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// edit option

let editElement;
let editFlag = false;
let editId = '';

// ****** EVENT LISTENERS **********
form.addEventListener('submit', addItem);
clearBtn.addEventListener('click', clearItems);
window.addEventListener('DOMContentLoaded', setupItems);


// ****** FUNCTIONS **********

// add item function
function addItem(e) {

    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();

    if (value && !editFlag) {
        createItemList(id, value);
        // display alert
        displayAlert('item added to the list', 'success');
        // show container
        container.classList.add('show-container');
        //add to local storage
        addToLocalStorage(id, value);
        //set back to default
        setBackToDefault();
    } else if (value && editFlag) {
        editElement.innerHTML = value
        displayAlert('item edited to the list', 'success');
        // edit local storage
        editLocalStorage(editId, value)
        setBackToDefault()

    } else {
        displayAlert('please enter value', 'danger')
    }
};
// end of submit function

// delete item function
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id
    list.removeChild(element);
    if (list.length < 0) {
        container.classList.remove('show-container');
    }
    displayAlert('item removed', 'danger');
    // set back 
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id)
}
// end of delete function

//edit item function
function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editId = element.dataset.id;
    submitBtn.textContent = 'edit';
}
// end of edit function

//clear all button
function clearItems() {
    const items = document.querySelectorAll('.grocery-item');
    if (items.length > 0) {
        items.forEach(item => {
            list.removeChild(item);
        });
    };
    container.classList.remove('show-container');
    displayAlert('empty list', 'danger');
    setBackToDefault();
    localStorage.removeItem('list')

}

// display alert function
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    // remove alert
    setTimeout(function () {
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
    }, 1000)
}


//set back to default
function setBackToDefault() {
    grocery.value = '';
    editFlag = false;
    editId = '';
    submitBtn.textContent = 'submit';
}
// ****** LOCAL STORAGE **********
// add local storage
function addToLocalStorage(id, value) {
    const todoList = { id, value };
    const items = getLocalStorage();
    items.push(todoList);
    localStorage.setItem('list', JSON.stringify(items));
}
// remove from local storage
function removeFromLocalStorage(id) {
    let items = getLocalStorage();
    items = items.filter(item => item.id !== id);
    localStorage.setItem('list', JSON.stringify(items));
}
// edit local storage
function editLocalStorage(editId, value) {
    let items = getLocalStorage();
    items = items.map(item => {
        if (item.id === editId) {
            item.value = value
        }
        return item
    })
    console.log(items)
    localStorage.setItem('list', JSON.stringify(items));
}
// get items from local storage
function getLocalStorage() {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];

}
// local storage API
// getItem
// setItem
//remove Item
// save as strings
// ****** SETUP ITEMS **********

function setupItems() {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach(item => {
            return createItemList(item.id, item.value)
        });
        container.classList.add('show-container');
    }
}
//create item list 
function createItemList(id, value) {
    const element = document.createElement('article');
    element.classList.add('grocery-item');
    //add id
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${value}</p>
          <div>
            <button type="button" class="edit-btn">
              <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn">
              <i class="fas fa-trash"></i>
            </button>
          </div>`
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);
    list.appendChild(element);

}
