var quill = new Quill('#editor-container', {
    formats: ['bold', 'italic', 'underline', 'link', 'strike', 'script', 'header', 'indent', 'list'],
    modules : {
      toolbar: false
    },
    theme: 'snow'  // or 'bubble'
  });

quill.keyboard.addBinding({
  key: 'S',
  shortKey: true
}, function(range, context) {
  if (context.format.strike != true) {
    this.quill.formatText(range, 'strike', true);
    save(quill.getContents());
  } else {
    this.quill.formatText(range, 'strike', false);
    save(quill.getContents());
  }
});

quill.keyboard.addBinding({
  key: 'D',
  shortKey: true
}, function(range, context) {
  if (context.format.list != 'bullet') {
    this.quill.formatLine(range, 'list', 'bullet');
    save(quill.getContents());
  } else {
    this.quill.formatLine(range, 'list', false);
    save(quill.getContents());
  }
});
  
quill.on('text-change', function(delta, oldDelta, source) {
  if (source == 'user') {
    var text = quill.getText();
    var indices = [-1];
    for(var i=0; i<text.length;i++) {
        if (text[i] === "\n") indices.push(i);
    }
    for (var i = 0; i < indices.length - 1; i++) {
      if (text.substring(indices[i] + 1, indices[i+1]).startsWith('##')) {
        quill.formatText(indices[i] + 1, indices[i+1] - indices[i] + 1, 'header', 2);
      } else if (text.substring(indices[i] + 1, indices[i+1]).startsWith('#')) {
        quill.formatText(indices[i] + 1, indices[i+1] - indices[i] + 1, 'header', 1);
      } else {
        quill.formatText(indices[i] + 1, indices[i+1] - indices[i] + 1, 'header', false);
      }
    }
    var re = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    while ((match = re.exec(text)) != null) {
        quill.formatText(match.index, match[0].length, { link: match[0] });
    }
    save(quill.getContents());
  }
});

quill.on('selection-change', function(range, oldRange, source) {
  if (range === null && oldRange !== null) {
    quill.focus();
  }
});

function save(data) {
  chrome.storage.local.set({ "Notes": data }, function(){
  });
}

function get() {
  chrome.storage.local.get("Notes", function(items){
      if (items.Notes === undefined) {
        console.log(intro)
        save(intro);
        quill.setContents(intro);
      } else {
        quill.setContents(items.Notes);
      }
  });
}

window.addEventListener('load', get);

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