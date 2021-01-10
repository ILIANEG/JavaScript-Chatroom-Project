/* This file handles username business, attaches listeners to UI elements
and calling appropriate functions when event is triggered */

//initial room selection, from local storage
document.getElementById(`${localStorage.getItem('lastChannel')}`)
.classList.add('selectedRoom');

//Initial Channel Set-up
if (localStorage.getItem('lastChannel') == null) {
    localStorage.setItem('lastChannel', 'general');
}

// Check if there is a name stored locally
if (localStorage.getItem('username') === null) {
    localStorage.setItem('username', 'anon');
    localStorage.setItem('id', undefined);
}

//checks if the nickname is already occupied
const nameIsTaken = async(name) => {
    //there can be unlimited number of anonymous users
    const users = await db.collection('users').get();
    return !users.docs.every(doc => {
        return doc.data().username !== name;
    });
}

//adds user to database if the name is acceptable and is not already taken
const recordUser = async(name) => {
    //check if the name is acceptable
    if (name == 'anon' || name =='Anon' || name === '' 
        || name == 'admin' || name == 'Admin') {
        throw new Error('Name is not acceptable');
    } 
    //check if name is taken
    const nameTaken = await nameIsTaken(name);
    if (nameTaken) {
        throw new Error('Username is already registered');
    } else {
        //if name is not taken, the old name (is not anon) is deleted 
        if (localStorage.getItem('username') !== 'anon') {
            await deleteUserRecord();
        }
        //remove old name locally
        localStorage.removeItem('username');
        localStorage.removeItem('id');
        //create new username object
        const newUser = {username: name, dateCreated: new Date()};
        //add new user document and return doc
        const usrRef = await db.collection('users').add(newUser);
        //set local data to new user
        localStorage.setItem('username', name);
        localStorage.setItem('id', usrRef.id);
    }
}
//function that deletes user record
const deleteUserRecord = async() => {
    if (!(localStorage.getItem('username') === 'anon')) {
        await db.collection('users').doc(`${localStorage.getItem('id')}`).delete();
    }
}

//event listener on submit of name update form
document.querySelector('.addName').addEventListener('submit', e => {
    e.preventDefault();
    //resolving promise fromasynchgronous functions
    recordUser(document.getElementsByClassName('nameField')[0].value.trim()).then()
            .catch(err => {
        //notify user what went wrong
        alert(err.message);
    });
    //reset name form
    document.getElementsByClassName('addName')[0].reset();
});

//Message send listener
document.getElementsByClassName('sendMessage')[0].addEventListener('submit', e => {
    e.preventDefault();
    const messageField = document.querySelector('.messageField');
    //check that value submited is not empty
    if (messageField.value !== '') {
        //cretae new message obejct
        const newMessageObj = {
            message: messageField.value,
            username: localStorage.getItem('username'),
            timestamp: new Date(),
            channel: document.querySelector('.selectedRoom').getAttribute('id')
        };
        //send message on server
        sendMessage(newMessageObj);
        //reset form
        document.getElementsByClassName('sendMessage')[0].reset();
    }
});

