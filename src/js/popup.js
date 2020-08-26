const back_console = chrome.extension.getBackgroundPage().console;
/*
When play button is pressed on popup.html file, the popup.js file retrieves the
selected text then stores it in storage and sends a message to background.js file
which in turn runs the synthesis file to convert text to speech.
 */
window.onload = function () {

    // Play button
    document.getElementById('play').onclick = function (element) {
        chrome.tabs.executeScript({
            code: "window.getSelection().toString();"
        }, function (selection) {
            document.getElementById("selectedText").value = selection[0];
            chrome.storage.local.set({text:selection[0]}, function (){
                back_console.log("Sent message");
                chrome.runtime.sendMessage({media_control:"Play", text:selection[0]});
            });
        });
    }

    // Pause button
    document.getElementById('pause').onclick = function () {
        chrome.runtime.sendMessage({media_control: "Pause"});
    }

    // Stop button
    document.getElementById('stop').onclick = function () {
        chrome.runtime.sendMessage({media_control: "Stop"});
    }


}

