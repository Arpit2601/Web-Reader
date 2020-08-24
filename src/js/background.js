const speak = require("./synthesis")
chrome.runtime.onInstalled.addListener(function() {
    console.log("Extension loaded");
});

// On receiving message start to speak
// bundle_background.js file is used as background script as it has all the required modules.
// To create it use "browserify background.js -o bundle_background.js -d"
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("Got message");
    const text = message.text;
    console.log("Message: " + text);
    speak(text);
});

