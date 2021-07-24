const request = window.indexedDB.open("tracker", 1);
let db, tx, store;

request.onupgradeneeded = function (e) {
  db = request.result;
  console.log("db this is DB", db);
  db.createObjectStore("trackerStore", { keyPath: "_id" });
};

request.onerror = function (e) {
  console.log("There was an error", e);
};

request.onsuccess = function (e) {
  db = request.result;
  console.log(getData);
  getData();
};

const getData = () => {
  tx = db.transaction("trackerStore", "readwrite");
  store = tx.objectStore("trackerStore");

  db.onerror = function (e) {
    console.log("error");
  };
  if (method === "put") {
    store.put(object);
  }
  if (method === "clear") {
    store.clear();
  }
  if (method === "get") {
    const all = store.getAll();
    all.onsuccess = function () {
      resolve(all.result);
    };
  }
  tx.oncomplete = function () {
    db.close();
  };
};

window.addEventListener("online", getData);
const saveRecord = ()