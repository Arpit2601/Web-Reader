const synthesis = require("./synthesis")
const xmlcont = chrome.runtime.getURL("ssml.xml");

chrome.runtime.onInstalled.addListener(function() {
    console.log("Extension loaded");
    chrome.storage.local.set({current_action: "Stopped", text: "", speed: "1"}, function () {
        console.log(`Initially in stopped state.`);
    });
});

// bundle_background.js file is used as background script as it has all the required modules.
// To create it use "browserify background.js -o bundle_background.js -d"
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
            // First retrieve text from chrome storage
            console.log("Play message received.");
            chrome.storage.local.get(["text", "language", "voice", "speed"], function (result){
                console.log(`Play: ${result.text}\n with language: ${result.language} and voice of ${result.voice}`);
                // change the text in voice tag to result.text then call Speak
                const xmlText = XMLEdit(xhr.responseText, result.text, result.language, result.voice, result.speed);
                console.log(xmlText);
                // synthesis.Speak(xmlText);
            });

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
    }
}

function XMLEdit(xmlResponseText, newText, language, voice, speed)
{
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlResponseText, "text/xml");
    xmlDoc.getElementsByTagName("prosody")[0].childNodes[0].nodeValue = newText;
    xmlDoc.getElementsByTagName("speak")[0].setAttribute("xml:lang", language);
    xmlDoc.getElementsByTagName("voice")[0].setAttribute("name", voice);
    xmlDoc.getElementsByTagName("prosody")[0].setAttribute("rate", speed);
    return new XMLSerializer().serializeToString(xmlDoc);
}

