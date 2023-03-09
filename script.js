const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');

let isEditMode = false;

function displayItems(e) {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => {
        addItemToDOM(item);
        checkUI();
    });
}

function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;
  // Validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }
//   Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove()
    isEditMode = false;
  }else {
    if(checkIfItemExists(newItem)){
        alert('This item already exists');
        return;
    }
  }
//   Create item DOM element
  addItemToDOM(newItem);

  // Add item to storage
  addItemToStorage(newItem);
 
  checkUI()
  itemInput.value = '';
}
// Saving to the DOM
function addItemToDOM(item) {
     // Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
    // Add li to the DOM
  itemList.appendChild(li);
}


function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage()
   
    // Add new item to the end of the array
    itemsFromStorage.push(item);
    // Convert to JASON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
    let itemsFromStorage;
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}

function onClickItem(e) {
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement)
        
    }else {
        setItemToEdit(e.target)
    }
}

function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
    isEditMode = true;
    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#091dd1';
    itemInput.value = item.textContent;


}

// function to remove item from list
function removeItem(item) {
    if(confirm('Are you sure you want to remove this item?')){
        // Remove item from the DOM
        item.remove();
        // Remove item from storage
        removeItemFromStorage(item.textContent);
        checkUI();
    };
    // if(e.target.parentElement.classList.contains('remove-item')){ 
    //     if(confirm('Are you sure you want to remove this item?')){ 
    //         e.target.parentElement.parentElement.remove();
    //         checkUI();
    //     }
    // }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage()
    // Filter out the item to be removed
    itemsFromStorage = itemsFromStorage.filter(i => i!== item);
    // Convert to JASON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
   
    
}

function clearItems() {
    while(itemList.firstChild) {
        // Add a confirmation prompt to the user
        //confirm('Are you sure you want to remove all items?');
        itemList.removeChild(itemList.firstChild);
    }
    // Clear from local storage
    localStorage.removeItem('items');
    checkUI();
}// Filter Items
function filterItems(e) {
    const filter = e.target.value.toLowerCase();
    const items = document.querySelectorAll('li');
    Array.from(items).forEach(function(item) {
        const itemText = item.firstChild.textContent;
        if (itemText.toLowerCase().indexOf(filter) != -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Check UI to see if there are items in the list
function checkUI() {
    const items = document.querySelectorAll('li')
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    }else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }
    formBtn.innerHTML = ('<i class="fa-solid fa-plus"></i> Add Item');
    formBtn.style.backgroundColor = '#091dd1';
    isEditMode = false;
}

// Initialize app
function init() {

    // Event Listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);
    
    // Running CheckUI in the global scope
    checkUI();
}
init();

