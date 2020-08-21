const speak = require("./synthesis");

window.onload = function () {
    document.getElementById('speak').onclick = function (element) {
        chrome.tabs.executeScript({
            code: "window.getSelection().toString();"
        }, function (selection) {
            document.getElementById("selectedText").value = selection[0];
            // chrome.storage.sync.set({"text":selection[0]});
            speak(selection[0]);
        });
    }
}
