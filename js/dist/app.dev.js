"use strict";

/* This file handles username business, attaches listeners to UI elements
and calling appropriate functions when event is triggered */
//initial room selection, from local storage
document.getElementById("".concat(localStorage.getItem('lastChannel'))).classList.add('selectedRoom'); //Initial Channel Set-up

if (localStorage.getItem('lastChannel') == null) {
  localStorage.setItem('lastChannel', 'general');
} // Check if there is a name stored locally


if (localStorage.getItem('username') === null) {
  localStorage.setItem('username', 'anon');
  localStorage.setItem('id', undefined);
} //checks if the nickname is already occupied


var nameIsTaken = function nameIsTaken(name) {
  var users;
  return regeneratorRuntime.async(function nameIsTaken$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(db.collection('users').get());

        case 2:
          users = _context.sent;
          return _context.abrupt("return", !users.docs.every(function (doc) {
            return doc.data().username !== name;
          }));

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}; //adds user to database if the name is acceptable and is not already taken


var recordUser = function recordUser(name) {
  var nameTaken, newUser, usrRef;
  return regeneratorRuntime.async(function recordUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(name == 'anon' || name == 'Anon' || name === '' || name == 'admin' || name == 'Admin')) {
            _context2.next = 2;
            break;
          }

          throw new Error('Name is not acceptable');

        case 2:
          _context2.next = 4;
          return regeneratorRuntime.awrap(nameIsTaken(name));

        case 4:
          nameTaken = _context2.sent;

          if (!nameTaken) {
            _context2.next = 9;
            break;
          }

          throw new Error('Username is already registered');

        case 9:
          if (!(localStorage.getItem('username') !== 'anon')) {
            _context2.next = 12;
            break;
          }

          _context2.next = 12;
          return regeneratorRuntime.awrap(deleteUserRecord());

        case 12:
          //remove old name locally
          localStorage.removeItem('username');
          localStorage.removeItem('id'); //create new username object

          newUser = {
            username: name,
            dateCreated: new Date()
          }; //add new user document and return doc

          _context2.next = 17;
          return regeneratorRuntime.awrap(db.collection('users').add(newUser));

        case 17:
          usrRef = _context2.sent;
          //set local data to new user
          localStorage.setItem('username', name);
          localStorage.setItem('id', usrRef.id);

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  });
}; //function that deletes user record


var deleteUserRecord = function deleteUserRecord() {
  return regeneratorRuntime.async(function deleteUserRecord$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (localStorage.getItem('username') === 'anon') {
            _context3.next = 3;
            break;
          }

          _context3.next = 3;
          return regeneratorRuntime.awrap(db.collection('users').doc("".concat(localStorage.getItem('id')))["delete"]());

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
}; //event listener on submit of name update form


document.querySelector('.addName').addEventListener('submit', function (e) {
  e.preventDefault(); //resolving promise fromasynchgronous functions

  recordUser(document.getElementsByClassName('nameField')[0].value.trim()).then()["catch"](function (err) {
    //notify user what went wrong
    alert(err.message);
  }); //reset name form

  document.getElementsByClassName('addName')[0].reset();
}); //Message send listener

document.getElementsByClassName('sendMessage')[0].addEventListener('submit', function (e) {
  e.preventDefault();
  var messageField = document.querySelector('.messageField'); //check that value submited is not empty

  if (messageField.value !== '') {
    //cretae new message obejct
    var newMessageObj = {
      message: messageField.value,
      username: localStorage.getItem('username'),
      timestamp: new Date(),
      channel: document.querySelector('.selectedRoom').getAttribute('id')
    }; //send message on server

    sendMessage(newMessageObj); //reset form

    document.getElementsByClassName('sendMessage')[0].reset();
  }
});