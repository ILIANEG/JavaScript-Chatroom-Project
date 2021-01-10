/* This javascript file is responsible for sending messages to server
and envoke real time listener for new messages */


//function that sends single message 
async function sendMessage(messageObj) {
    await db.collection('messages').add(messageObj);
}

//real time chat listener
db.collection('messages').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
            const doc = change.doc;
            //check if current message from the same channel
            if (localStorage.getItem('lastChannel') === doc.data().channel) {
                loadMessage(doc.data());
                const listElems = document.getElementsByClassName('list-group-item');
            }
        } else {
            location.reload();
        }
    });
});

