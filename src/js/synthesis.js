const sdk = require("microsoft-cognitiveservices-speech-sdk");
// console.log(process.env.WEB_READER_SUB_KEY);
// TODO:: change subscription key and region to env variables
const subscriptionKey = "10b322ea334247e0bd2e5660ab08a704";
const serviceRegion = "centralindia"; // e.g., "westus"

const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
// TODO:: see how to output to speakers directly
const audioConfig = sdk.AudioConfig.fromSpeakerOutput();


module.exports = function Speak(text) {
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    synthesizer.speakTextAsync(
        text,
        result => {
            if (result) {
                console.log(JSON.stringify(result));
            }
            synthesizer.close();
        },
        error => {
            console.log(error);
            synthesizer.close();
        });

}

