//establish variable db to hold db connection
let db;

//contect to indexedDB database "budget_tracker" version 1
const request = indexedDB.open('budget_tracker', 1);

//execute function if database version changed
request.onupgradeneeded = function(event) {

    //save reference to previous database version
    const db = event.target.result;

    //Create object store with an auto incrementing primary key
    db.createObjectStore('new_transaction', { autoIncrement: true });
};

//function for successful database
request.onsuccess = function(event) {

    //save reference for successful db to global variable
    db = event.target.result;

    //run uploadTransaction() function to send all local db data to api if app online
    if (navigator.onLine) {
        uploadTransaction();
    }
};

//function to send all local db data to api
function uploadTransaction() {

    //open db transaction
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    //connect to object store
    const budgetObjectStore = transaction.objectStore('new_transaction');

    //variable to store all records from object store
    const getAll = budgetObjectStore.getAll();

    //function to get all records on success
    getAll.onsuccess = function() {

        //send data stored in indexeddb to api server
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }

                // open new transaction
                const transaction = db.transaction(['new_transaction'], 'readwrite');

                // connect to new transaction object store
                const budgetObjectStore = transaction.objectStore('new_transaction');

                // clear all items in budget object store
                budgetObjectStore.clear();

                alert('All saved transactions submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
}

//function to submit transaction without internet connectionj
function saveRecord(record) {
    //open new transaction
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    //connect to object store for new transaction
    const budgetObjectStore = transaction.objectStore('new_transaction');

    //add record to object store
    budgetObjectStore.add(record);
}

