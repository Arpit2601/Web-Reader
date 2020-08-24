const sdk = require("microsoft-cognitiveservices-speech-sdk");
// TODO:: change subscription key and region to env variables
// Not possible like this as extension does not have access to the host OS.
// To tackle this either implement host messaging protocol or run a script to get env variables before starting the extension or get variables from users in UI
// console.log(process.env.WEB_READER_SUB_KEY);
const subscriptionKey = "Your Subscription Key";
const serviceRegion = "Subscription Region"; // e.g., "centralindia"

const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
const audioConfig = sdk.AudioConfig.fromSpeakerOutput();


module.exports = function Speak(text) {
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    chrome.extension.getBackgroundPage().console.log("In synthesis file. " + text);
        synthesizer.speakTextAsync(
            text,
            result => {
                if (result) {
                    chrome.extension.getBackgroundPage().console.log(JSON.stringify(result));
                }
                synthesizer.close();
            },
            error => {
                chrome.extension.getBackgroundPage().console.log(error);
                synthesizer.close();
            });
}

