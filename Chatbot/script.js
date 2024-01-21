const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const API_KEY = "AIzaSyBzaKrAPrkn1nlgOmrSpEUUmGCTtq_csGg"; // Paste your API key here
const GEMINI_API_BASE_URL = "https://www.googleapis.com/admanager/v202205"; // Adjust the API version based on your needs
const inputInitHeight = chatInput.scrollHeight;

// Function to make a request to the Google Gemini API
const callGeminiAPI = (path, method = "GET", data = null) => {
    const url = `${GEMINI_API_BASE_URL}/${path}`;
    const headers = {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
    };

    const requestOptions = {
        method,
        headers,
        body: data ? JSON.stringify(data) : null,
    };

    return fetch(url, requestOptions)
        .then(response => response.json())
        .catch(error => {
            console.error("Error calling Gemini API:", error);
            throw error;
        });
};

// Example of using Gemini API to get a list of campaigns
const getCampaigns = () => {
    const path = "campaigns";
    return callGeminiAPI(path);
};

// Function to handle the chat and Gemini API calls
const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if(!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        // Example: Call Gemini API to get campaigns
        getCampaigns()
            .then(data => {
                // Process the Gemini API response and update the chat
                const campaignsMessage = "Gemini API response: " + JSON.stringify(data);
                incomingChatLi.querySelector("p").textContent = campaignsMessage;
            })
            .catch(() => {
                incomingChatLi.querySelector("p").classList.add("error");
                incomingChatLi.querySelector("p").textContent = "Oops! Error calling Gemini API.";
            })
            .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
    }, 600);
};

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));