function save(data) {
    chrome.storage.local.set({ "Notes": data }, function(){
        console.log("Data saved")
    });
}

function get() {
    chrome.storage.local.get("Notes", function(items){
        document.getElementById('efgh').innerHTML = items.Notes;
    });
}

var b = document.getElementById('efgh');
window.addEventListener('load', get);

b.addEventListener('input', save);

var hidden, visibilityChange; 
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

function handleVisibilityChange() {
    if (!document[hidden]) {
        get()
    }
  }

document.addEventListener(visibilityChange, handleVisibilityChange, false);