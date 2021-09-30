//establish variable db to hold db connection
let db;

//contect to indexedDB database "budget_tracker" version 1
const request = indexedDB.open('budget_tracker', 1);

