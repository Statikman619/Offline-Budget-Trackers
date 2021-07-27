let db;
// create a new db request for a "budget" database.
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  // create object store called "trackerStore" and set autoIncrement to true
  const db = event.target.result;
  db.createObjectStore("trackerStore", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;
  console.log("request result", db);

  // check if app is online before reading from db
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  console.log("Woops! " + event.target.errorCode);
};

function saveRecord(record) {
  // create a transaction on the trackerStore db with readwrite access
  const transaction = db.transaction(["trackerStore"], "readwrite");

  // access your trackerStore object store
  const store = transaction.objectStore("trackerStore");

  // add record to your store with add method.
  store.add(record);
}

function checkDatabase() {
  // open a transaction on your trackerStore db
  const transaction = db.transaction(["trackerStore"], "readwrite");
  // access your trackerStore object store
  const store = transaction.objectStore("trackerStore");
  // get all records from store and set to a variable
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          // if successful, open a transaction on your trackerStore db
          const transaction = db.transaction(["trackerStore"], "readwrite");

          // access your trackerStore object store
          const store = transaction.objectStore("trackerStore");

          // clear all items in your store
          store.clear();
        });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);
