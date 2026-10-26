let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");
let searchInput = document.querySelector("#searchInput");
let searchBtn = document.querySelector("#searchBtn");

document.getElementById("home").addEventListener("click", () => {
    speak("Navigating to Home.");
    
});

//document me kahi bhi click krenge to navbar off hojaega...
document.addEventListener("DOMContentLoaded" , ()=>{
    const navoff = document.getElementById("checkbox");
    const navbar = document.getElementById("navbar");

    document.addEventListener("click" , (e)=>{
        if(!navbar.contains(e.target) && e.target!== navoff && e.target !== document.querySelector("fa-duotone fa-solid fa-bars")){
            navoff.checked = false ;
        }
    });

});

document.getElementById("about").addEventListener("click", () => {
    speak("I am a virtual assistant designed to help you with various tasks. You can ask me for the weather, open websites, and much more.");

});

document.getElementById("help").addEventListener("click", () => {
    speak("Here to assist. You can say commands like 'Open YouTube,' 'Check the weather,' or 'What is the time?'");
});

document.getElementById("feedback").addEventListener("click", () => {
    speak("You can provide feedback by sending an email or comment");
    document.getElementById("pbox").style.display = "block";
});


const popup = document.getElementById("pbox");
popup.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = "none"; 
    }
};

function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1.2;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "hi-GB"; 
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    let day = new Date();
    let hours = day.getHours();
    if (hours >= 0 && hours < 12) {
        speak("Good Morning Sir");
    } else if (hours >= 12 && hours < 16) {
        speak("Good Afternoon Sir");
    } else {
        speak("Good Evening Sir, how can I help you");
    }
}

// window.addEventListener('load', () => {
//     wishMe();
// });

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
if (!speechRecognition) {
    console.error("Speech Recognition not supported in this browser.");
} else {
    let recognition = new speechRecognition()

    recognition.continuous = false; 
    recognition.interimResults = false; 
    

    
    recognition.onstart = () => {
        console.log("Voice recognition activated. Try speaking into the microphone.");
    };

    recognition.onresult = (event) => {

        console.log(event)
        let currentIndex = event.resultIndex;
        let transcript = event.results[currentIndex][0].transcript;
        content.innerText = transcript;
        takeCommand(transcript.toLowerCase());
    };

    recognition.onerror = (event) => {
        console.error("Recognition error: ", event.error);
        speak("Sorry, I didn't catch that. Please try again.");
    };

    recognition.onend = () => {
        console.log("Voice recognition turned off.");
        btn.style.display = "flex"; 
        voice.style.display = "none"; 
    };

    btn.addEventListener("click", () => {
        recognition.start();
        voice.style.display = "block";
        btn.style.display = "none";
    });
}

searchBtn.addEventListener("click", () => {
    let message = searchInput.value.toLowerCase();
    takeCommand(message);
});



searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        let message = searchInput.value.toLowerCase();
        takeCommand(message);
    }
});

function getWeather(city) {
    let apiKey = '83733417abbd159fd8804751e147bdb7'; 
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("City not found");
            return response.json();
        })
        .then(data => {
            let temp = data.main.temp;
            let weather = data.weather[0].description;
            let finalText = `The temperature in ${city} is ${temp} degrees Celsius with ${weather}.`;
            speak(finalText);
        })
        .catch(error => {
            speak("Sorry, I couldn't fetch the weather information right now. " + error.message);
        });
}


let searchHistory = [];

function takeCommand(command) {
    voice.style.display = "none";
    btn.style.display = "flex";
 
    console.log("Command Received: " , command);
    searchHistory.push(command);
    document.addEventListener('DOMContentLoaded', function() {
        displaySearchHistory();
    });
    console.log("History Updated: " , searchHistory);

// // searchHistory ke liye 
// function displaySearchHistory(){
//     const historyContainer = document.getElementById("SearchHistoryContainer");
//     historyContainer.innerHTML = "" ;
    
//     searchHistory.forEach((query , index) =>{
//         const historyItem = document.createElement("div");
//         historyItem.textContent = `${index+1}.${query}`;
//         historyContainer.appendChild(historyItem);
//     });
//     console.log("Displayed Search history: " , searchHistory);
// }

    if (command.includes("hello") || command.includes("hey")) {
        speak("Hello Sir, what can I help you with?");
    } else if (command.includes("who are you")) {
        speak("I am a virtual assistant, S.A.Y.");
    } else if (command.includes("open youtube") || command.includes("youtube") || command.includes("youtube kholo")) {
        speak("Opening YouTube...");
        window.open("https://youtube.com/", "_blank");
    } else if (command.includes("open google") || command.includes("google")) {
        speak("Opening Google...");
        window.open("https://google.com/", "_blank");
    } else if (command.includes("open facebook") || command.includes("facebook")) {
        speak("Opening Facebook...");
        window.open("https://facebook.com/", "_blank");
    } else if (command.includes("open instagram") || command.includes("instagram")) {
        speak("Opening Instagram...");
        window.open("https://instagram.com/", "_blank");
    } else if (command.includes("open calculator")) {
        speak("Opening calculator...");
        window.open("calculator://");
    } else if (command.includes("open whatsapp")) {
        speak("Opening WhatsApp...");
        window.open("whatsapp://");
    } 
    else if (command.includes("what is your name")) {
        speak("hi my name is say...");
       }

        else if (command.includes("time")) {
        let time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak(`The current time is ${time}.`);
    } else if (command.includes("date")) {
        let date = new Date().toLocaleString(undefined, { day: "numeric", month: "short" });
        speak(`Today's date is ${date}.`);
    } else if (command.includes("weather")) {
        let city = command.split("in ")[1] || "Gorakhpur"; 
        getWeather(city.trim());
    } else {
        speak("This is what I found on the internet regarding " + command);
        window.open(`https://www.google.com/search?q=${command}`, "_blank");
    }
    
}

