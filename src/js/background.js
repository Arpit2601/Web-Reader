const synthesis = require("./synthesis")
chrome.runtime.onInstalled.addListener(function() {
    console.log("Extension loaded");
});

// On receiving message start to speak
// bundle_background.js file is used as background script as it has all the required modules.
// To create it use "browserify background.js -o bundle_background.js -d"
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("Got message in background.");
    const media_control = message.media_control;
    if(media_control === "Play")
    {
        console.log(`Play: ${message.text}`);
        synthesis.Speak(message.text);
    }
    else if(media_control === "Pause")
    {
        console.log(`Pause.`);
        synthesis.Pause();
    }
    else if(media_control === "Stop")
    {
        console.log(`Stop.`)
        synthesis.Stop();
    }

});

