const synthesis = require("./synthesis")
const xmlcont = chrome.runtime.getURL("ssml.xml");
const worker = new Worker('./Worker.js');


chrome.runtime.onInstalled.addListener(function() {
    console.log("Extension loaded");
    chrome.storage.local.set({current_action: "Stopped", text: "", speed: "1"}, function () {
        console.log(`Initially in stopped state.`);
    });
});
/*
    bundle_background.js file is used as background script as it has all the required modules.
    To create it use "browserify background.js -o bundle_background.js -d"
*/
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("Got message in background.");
    const xhr = new XMLHttpRequest();
    xhr.open("GET", xmlcont);
    xhr.overrideMimeType('text/xml');
    xhr.onload = function (){
        GetSSMLText(xhr, message);
    };
    xhr.send(null);


});

function GetSSMLText(xhr, message)
{
    if (xhr.readyState === xhr.DONE && xhr.status === 200)
    {
        const media_control = message.media_control;
        if(media_control === "Play")
        {
            // First retrieve text from chrome storage then start/resume worker
            console.log("Play message received.");
            chrome.storage.local.get(["text", "language", "voice", "speed"], function (result){
                console.log(`Play: ${result.text}\n with language: ${result.language} and voice of ${result.voice}`);
                worker.sendMessage({msg: 'Play', xmlResponseText: xhr.responseText, text: result.text, language: result.language, voice: result.voice, speed: result.speed});
            });

        }
        else if(media_control === "Pause")
        {
            console.log(`Pause.`);
            synthesis.Pause();
            /*
                Even though we are sending this message it will never be used by worker as it also a single thread
            */
            // worker.sendMessage({msg: 'Pause'});
        }
        else if(media_control === "Stop")
        {
            console.log(`Stop.`)
            synthesis.Stop();
            // worker.sendMessage({msg: 'Stop'});
        }
    }
}


