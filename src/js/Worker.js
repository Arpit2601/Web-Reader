/*
    This file is used to send chunks to Synthesis.js and works like a different thread.
*/

const synthesis = require("./synthesis");

// TODO: find better thresholds
const thresh_words = 20;
const thresh_chars = 100;
const thresh_time = 3000;    // in milliseconds
let prev_chunk_time;
let index=0;
let TextLines;
let chars;
let words;
let xmlText;
// let working = true;


self.addEventListener('message', function (e){
    let data = e.data;
    if(data.msg === 'Play')
    {
        // Calling of synthesis will depend on the previous sent chunk.
        // If previous had more characters or words then this chunk will wait otherwise not.

        if(index === 0)
        {
            // TODO: find a better way to break into chunks
            TextLines = data.text.split('. ').join('\n').split(/\n+/);
            chars = TextLines[0].length;
            words = TextLines[0].split('\s');
            xmlText = XMLEdit(data.xmlResponseText, TextLines[0], data.language, data.voice, data.speed);
            synthesis.Speak(xmlText);   // Send the first one immediately
            prev_chunk_time = Date.now();
        }
        index++;

        for(index; index<TextLines.length; index++)
        {
            // Keep the second ready
            xmlText = XMLEdit(data.xmlResponseText, TextLines[index], data.language, data.voice, data.speed);
            console.log(xmlText);

            // info about current chunk
            console.log(`Number of characters ${TextLines[index].length}, Number of words ${TextLines[index].split('\s').length}`);

            // If previous had both less characters and less words then call immediately
            if(chars<=thresh_chars && words<=thresh_words)
            {
                synthesis.Speak(xmlText);
                prev_chunk_time = Date.now();
            }
            else
            {
                // Wait for n sec then send
                while(Date.now()-prev_chunk_time<thresh_time){}
                synthesis.Speak(xmlText);
                prev_chunk_time = Date.now();
            }

            // Update variables to be used by next chunk
            chars = TextLines[index].length;
            words = TextLines[index].split('\s').length;

            // Now check if we are in pause or stop.
            // If in stopped then break this loop
            // If in paused then wait
            if(synthesis.stopped === true)
            {
                break;
            }
            do
            {
                if(synthesis.paused === false){break;}
            } while(true);

        }
        index = 0;
    }
    // else if(data.msg === 'Pause')
    // {
    //     working = false;
    // }
    // else
    // {
    //     working = false;
    // }
});


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