'use strict';

//////////////////////////////////////////
// Variables
let bookmarkToDelete = null;



//////////////////////////////////////////
// Select DOM elements
const addButton = document.getElementById('addBookmark');
const inputName = document.getElementById('name');
const inputURL = document.getElementById('url');
const bookMarkList = document.getElementById('bookmarkList');
const modalCloseButton = document.getElementById('modalClose');
const modalConfirmButton = document.getElementById('confirm');
const modalCancelButton = document.getElementById('cancel');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');



///////////////////////////////////////////////////
// Event Listeners
document.addEventListener("DOMContentLoaded", loadPreviousBookmarks);
document.addEventListener('keydown', exitModalByKeyPress);
modalConfirmButton.addEventListener('click', deleteBookmark);
modalCloseButton.addEventListener('click',closeModal);
modalCancelButton.addEventListener('click',closeModal);
addButton.addEventListener('click', addToDOM);



////////////////////////////////////////////////////
// Functions

// Add bookmark to DOM
function addToDOM(){
    // Set var name and url based on input values
    const name = inputName.value.trim();
    const url = inputURL.value.trim();

    // Check if input fields are not empty
    if(!name || !url){
        alert("You must enter both name and url fields");
        return;
    }

    // Check if the url is valid (starts with http or https)
    if(!url.startsWith('http://') && !url.startsWith('https://')){
        alert("Please enter a valid URL");
        return;
    }

    // Add bookmark to ul list
    addBookmarkToDOM(name, url);

    //Save to Local Storage
    saveToLocalStorage(name, url);

    // Clear Input Values
    inputName.value = "";
    inputURL.value = "";
}

// Returns Bookmarks from Local Storage
function loadFromStorage(){
    return JSON.parse(localStorage.getItem("bookmarks")) || [];
}

// Save Bookmark to Local Storage
function saveToLocalStorage(name, url){
    // bookmark is a list of all bookmarks stored in Local Storage
    const bookmark = loadFromStorage();
    bookmark.push({name, url});
    
    // JSON.stringify convert the object to a string before storing
    localStorage.setItem("bookmarks", JSON.stringify(bookmark));
}

// Load bookmarks from local storage
function loadPreviousBookmarks(){
    const bookmarks = loadFromStorage();
    bookmarks.forEach(bookmark => addBookmarkToDOM(bookmark.name, bookmark.url));
}

// Add New Bookmark to the DOM
function addBookmarkToDOM(name, url){
    // Create ul elements
    const li = document.createElement('li');
    const aLink = document.createElement('a');
    const removeButton = document.createElement('button');

    aLink.href = url;
    aLink.textContent = name;
    aLink.target = "_blank";

    removeButton.textContent = "Remove";
    removeButton.classList.add('removeBookMark');
    removeButton.addEventListener('click', function(){
        bookmarkToDelete = {li, name, url};
        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
    });
        
    li.appendChild(aLink);
    li.appendChild(removeButton);
    bookMarkList.prepend(li);
}

// Delete a bookmark after clicking the confirmation button
function deleteBookmark(){
    if(bookmarkToDelete){
        bookMarkList.removeChild(bookmarkToDelete.li);
        removeBookmarkFromDOM(bookmarkToDelete.name, bookmarkToDelete.url);
        closeModal();
        bookmarkToDelete = null;
    }
}

// Remove bookmark from the DOM
function removeBookmarkFromDOM(name, url){
    let bookmarks = loadFromStorage();
    bookmarks = bookmarks.filter(bookmark => bookmark.name != name|| bookmark.url !== url);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

// Set class "hidden" to modal window and overlay
function closeModal(){
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
}

// Use escape key to exit modal window
function exitModalByKeyPress(event){
     if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
}