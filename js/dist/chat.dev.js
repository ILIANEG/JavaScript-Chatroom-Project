"use strict";

/* This javascript file is responsible for sending messages to server
and envoke real time listener for new messages */
//function that sends single message 
function sendMessage(messageObj) {
  return regeneratorRuntime.async(function sendMessage$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(db.collection('messages').add(messageObj));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
} //real time chat listener


db.collection('messages').onSnapshot(function (snapshot) {
  snapshot.docChanges().forEach(function (change) {
    if (change.type === 'added') {
      var doc = change.doc; //check if current message from the same channel

      if (localStorage.getItem('lastChannel') === doc.data().channel) {
        loadMessage(doc.data());
        var listElems = document.getElementsByClassName('list-group-item');
      }
    } else {
      location.reload();
    }
  });
});