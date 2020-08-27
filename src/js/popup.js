const back_console = chrome.extension.getBackgroundPage().console;

/*
    Chrome storage stores text and current action of media control.
 */

window.onload = function () {

    // set text area to current playing text
    chrome.storage.local.get("text", function (result){
        document.getElementById("selectedText").value = result.text;
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
                   if(selection[0]!=="")
                   {
                       chrome.storage.local.set({text: selection[0]}, function (){
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


}

