/* This javascript file handles UI events such as loading messages,
displaying new message, switching channel, etc. */

//event listener on channel selector. When a new channnel is selected channel is loaded 
document.getElementsByClassName('roomSelection')[0].addEventListener('click', e => {
    if (e.target.classList.contains('room')) {
        const currSelected = document.getElementsByClassName('selectedRoom');
        if (currSelected != null) {
            currSelected[0].classList.remove('selectedRoom');
        }
        //select new room/channel
        e.target.classList.add('selectedRoom');
        localStorage.setItem('lastChannel', e.target.getAttribute('id'));
        //we need to reload page to trigger real time listener
        location.reload();
    }
});

//function that loads a signle message on UI
function loadMessage(messageObj, ulElem = document.querySelector('ul')) {
    //special case we can use loadMessage() to represent no messages
    if (messageObj === null) {
        ulElem.innerHTML = '<li class="list-group-item" id="placeholder">No Messages Found</li>';
    }
    //we delete placeholder (no messages) if it exists
    if (document.getElementById('placeholder') !== null) {
        ulElem.innerHTML = '';
    }
    //add new element list
    ulElem.innerHTML +=
        `<li class="list-group-item"><strong>${messageObj.username}: </strong>
            <span class="message">${messageObj.message}</span>
            <span class="timestamp" id="${messageObj.timestamp.toDate().getTime()}">${timeGenerator(messageObj.timestamp)}</span>
        </li>`;
    //scroll to the bottom of message list whenever new child is added
    if (0 < ulElem.children.length) {
        ulElem.children[ulElem.children.length - 1].scrollIntoView();
    }
}

//generates string of how long ago was message written
function timeGenerator(timestamp, isIntValue=false) {
    if (isIntValue) {
        var diff = Math.round((new Date().getTime() - timestamp) / 1000 / 60);
    } else {
        var diff = Math.round((new Date().getTime() - timestamp.toDate().getTime()) / 1000 / 60); 
    }
    if (diff < 1) {
        return 'less then a minute ago';
    } else if (diff < 60) {
        return `about ${diff} minutes ago`;
    } else {
        return `about ${Math.round(diff / 60)} hours ago`;
    }
    
}

//Delayed function shows message if no messages were found
setTimeout(() => {
    if (Array.from(document.getElementsByClassName('list-group-item')).length === 0) {
        document.querySelector('ul').innerHTML = '<li class="list-group-item" id="placeholder">No Messages Found</li>';
    }
}, 1000);

//time update function
setInterval(() => {
    const timestamps = Array.from(document.getElementsByClassName('timestamp'));
    if (0 < timestamps.length) {
        if (timestamps.length == 0) {

        }
        timestamps.forEach((timestamp) => {
            timestamp.innerText = timeGenerator(Number(timestamp.getAttribute('id')), true);
        });
    }
}, 60000);