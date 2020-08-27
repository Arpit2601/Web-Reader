const sdk = require("microsoft-cognitiveservices-speech-sdk");


// TODO:: change subscription key and region to env variables
// Not possible like this as extension does not have access to the host OS.
// To tackle this either implement host messaging protocol or run a script to get env variables before starting the extension or get variables from users in UI
// console.log(process.env.WEB_READER_SUB_KEY);
const subscriptionKey = "Your subscription key";
const serviceRegion = "Your subscription region"; // e.g., "centralindia"
const back_console = chrome.extension.getBackgroundPage().console;


const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
const context = new AudioContext();
let source;
let paused;
let startedAt;
let pausedAt;
let soundBuffer;

function Speak(text) {
    //----------------------------------------------------------------
    // This works and outputs directly to speaker
    // const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    // chrome.extension.getBackgroundPage().console.log("In synthesis file. " + text);
    //     synthesizer.speakTextAsync(
    //         text,
    //         result => {
    //             if (result) {
    //                 chrome.extension.getBackgroundPage().console.log(JSON.stringify(result));
    //             }
    //             synthesizer.close();
    //         },
    //         error => {
    //             chrome.extension.getBackgroundPage().console.log(error);
    //             synthesizer.close();
    //         });
    //-----------------------------------------------------------------
    // This just returns the array buffer of audio output.
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);

    synthesizer.speakTextAsync(
        text,
        result => {
            // Interact with the audio ArrayBuffer data
            const audioData = result.audioData;
            back_console.log(`Audio data byte size: ${audioData.byteLength}.`)
            back_console.log(`Audio Data: ${audioData}`);
            Load(audioData);
            synthesizer.close();
        },
        error => {
            console.log(error);
            synthesizer.close();
        });
}

function Load(audioData)
{
    back_console.log("In Load function.");
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context.decodeAudioData(audioData, function (soundBuffer_temp){
        soundBuffer = soundBuffer_temp;
        Play();
    }, function (err){
        back_console.log("couldn't decode buffer");
    });

}
function Play()
{
    back_console.log("In Play function.");
    source = context.createBufferSource();
    source.buffer = soundBuffer;
    source.connect(context.destination);
    source.addEventListener('ended', () => {
        if(paused === true)
        {
            // Do nothing
        }
        else
        {
            chrome.storage.local.set({current_action: "Stopped"}, function (){
                back_console.log("Speech has finished.");
                soundBuffer = null;
                pausedAt = null;
            });
        }

    });
    paused = false;
    chrome.storage.local.set({current_action: "Playing"}, function (){
        back_console.log("Current_action set to Playing.");

        if(pausedAt)
        {
            back_console.log("Resuming from: " + (pausedAt-startedAt)/1000);
            source.start(0, (pausedAt-startedAt)/1000); // Offset only possible in seconds
            // startedAt = Date.now();
        }
        else
        {
            back_console.log("Starting from beginning.");
            startedAt = Date.now();
            source.start(0);
        }
    });



}

function Pause()
{
    back_console.log("In Pause function.");
    paused = true;
    pausedAt = Date.now();
    back_console.log("Paused at: " + pausedAt);
    source.stop(0);

    chrome.storage.local.set({current_action: "Paused"}, function (){
        back_console.log("Current_action set to Paused.");
    });
}

function Stop()
{
    back_console.log("In Stop function.");
    source.stop(0);
    soundBuffer = null;
    pausedAt = null;

    chrome.storage.local.set({current_action: "Stopped"}, function (){
        back_console.log("Current_action set to Stopped.");
    });

}

function onEnded()
{
    chrome.storage.local.set({current_action: "Stopped"}, function (){
        back_console.log("Speech has finished.");
        soundBuffer = null;
        pausedAt = null;
    });
}

module.exports = {Speak: Speak, Pause: Pause, Stop: Stop};