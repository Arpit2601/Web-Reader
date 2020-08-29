const back_console = chrome.extension.getBackgroundPage().console;

/*
    Chrome storage stores text and current action of media control.
 */

window.onload = function () {

    // set text area to current playing text
    chrome.storage.local.get(["text", "speed"], function (result){
        document.getElementById("selectedText").value = result.text;
        document.getElementById("speed_text").innerHTML = result.speed;
        document.getElementById("speed").value = result.speed;
    });
    // Play button
    document.getElementById('play').onclick = function (element) {
        chrome.storage.local.get("current_action", function (result) {
           if(result.current_action.toString() === "Stopped")
           {
               back_console.log("Currently stopped.");
               // Get selected text -> store it in storage -> send message to background
               chrome.tabs.executeScript({code: "window.getSelection().toString();"}, function (selection){
                   document.getElementById("selectedText").value = selection[0];
                   back_console.log(`Selected text: ${selection[0]}`);
                   // Getting the voice selected
                   const voice_elem = document.getElementById("voices");
                   const voice = voice_elem.options[voice_elem.selectedIndex].value;
                   const lang = voice.split(" ")[0], voice_name = voice.split(" ")[1];
                   // Getting the playback speed
                   const speed = document.getElementById("speed").value;
                   back_console.log(speed);
                   // document.getElementById("speed_text").innerText = speed.toString();
                   if(selection[0]!=="")
                   {
                       chrome.storage.local.set({text: selection[0], language: lang, voice: voice_name, speed: speed.toString()}, function (){
                           back_console.log("Play message sent.");
                           chrome.runtime.sendMessage({media_control: "Play"}, function (){});

                       }) ;
                   }

               });
           }
           else if(result.current_action.toString() === "Paused")
           {
               // Continue playing previous text
               // simply send play message to background
               back_console.log("Currently paused.");
               chrome.runtime.sendMessage({media_control: "Play"}, function (){
                  back_console.log("Play message sent.");
               });
           }
           else if(result.current_action.toString() === "Playing")
           {
               // Continue playing previous text
               // simply send play message to background
               back_console.log("Currently playing.");
               chrome.runtime.sendMessage({media_control: "Play"}, function (){
                   back_console.log("Play message sent.");
               });
           }
        });

    }

    // Pause button
    document.getElementById('pause').onclick = function () {
        chrome.runtime.sendMessage({media_control: "Pause"});
    }

    // Stop button
    document.getElementById('stop').onclick = function () {
        chrome.runtime.sendMessage({media_control: "Stop"});
        document.getElementById("selectedText").value = "";
    }

    let slider = document.getElementById("speed");
    slider.oninput = function () {
        let speed_text = document.getElementById("speed_text");
        speed_text.innerHTML = slider.value;
    }
}


