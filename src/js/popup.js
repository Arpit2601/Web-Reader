/*
When play button is pressed on popup.html file, the popup.js file retrieves the
selected text then stores it in storage and sends a message to background.js file
which in turn runs the synthesis file to convert text to speech.
 */
window.onload = function () {
    document.getElementById('speak').onclick = function (element) {
        chrome.tabs.executeScript({
            code: "window.getSelection().toString();"
        }, function (selection) {
            document.getElementById("selectedText").value = selection[0];
            chrome.storage.local.set({text:selection[0]}, function (){
                chrome.extension.getBackgroundPage().console.log("Sent message");
                chrome.runtime.sendMessage({text:selection[0]});
            });
        });
    }

}

window.on
