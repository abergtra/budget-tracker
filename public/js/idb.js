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

