const input = document.getElementById("llm__input");
const button = document.getElementById("llm__button");
const chatLog = document.getElementById("chat-log");
const loader = document.getElementById("loader");
const shortcuts = document.getElementById("shortcuts");
const chatContainer = document.getElementById("chat-container");

let history = JSON.parse(localStorage.getItem("chatHistory")) || [];

function saveHistory() {
  localStorage.setItem("chatHistory", JSON.stringify(history));
}

function loadHistory() {
  history.forEach(entry => addMessage(entry.sender, entry.text));
}

async function sendMessage(prompt) {
  const model = "phi3";

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt, stream: false })
  };

  loader.style.display = "block";

  try {
    const response = await fetch("http://localhost:11434/api/generate", options);
    const data = await response.json();

    addMessage("user", prompt);
    history.push({ sender: "user", text: prompt });

    addMessage("ai", data.response);
    history.push({ sender: "ai", text: data.response });

    saveHistory();
  } catch (err) {
    addMessage("error", "Er is iets misgegaan.");
    console.error(err);
  }

  loader.style.display = "none";
}

function addMessage(sender, text) {
  const li = document.createElement("li");
  li.className = sender;
  li.textContent = (sender === "user" ? "👤 " : sender === "ai" ? "🤖 " : "⚠️ ") + text;
  chatLog.appendChild(li);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function clearChat() {
  localStorage.removeItem("chatHistory");
  chatLog.innerHTML = "";
  history = [];
}

function switchTab(tab) {
  const prompts = {
    cyber: [
      "Scan deze code op kwetsbaarheden (XSS, SQLi, etc.): ",
      "Genereer een veilig wachtwoord met minimaal 16 karakters",
      "Simuleer een phishing-aanval e-mail voor educatief gebruik",
      "Wat doet dit shell-commando: ",
      "Geef een lijst met veelgebruikte poorten en hun standaard services"
    ],
    code: [
      "Leg deze code stap voor stap uit: ",
      "Optimaliseer deze Python functie: ",
      "Los bugs op in deze JavaScript code: ",
      "Genereer een veilige login functie in PHP",
      "Schrijf een voorbeeldscript voor een API request in Python"
    ],
    learn: [
      "Wat is het verschil tussen hashing en encryptie?",
      "Leg uit wat een SQL-injectie is en hoe je het voorkomt",
      "Wat is het OWASP Top 10 overzicht?",
      "Geef uitleg over HTTPS versus HTTP",
      "Wat is een buffer overflow en hoe werkt het?"
    ],
    tools: [
      "Genereer een regex om e-mails te herkennen",
      "Leg deze regex uit: ^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
      "Maak een regex om Nederlandse telefoonnummers te herkennen",
      "Wat doet het commando: netstat -ano?",
      "Leg uit: nmap -sS -T4 192.168.1.1/24",
      "Geef een proof-of-concept XSS-payload in JavaScript",
      "Schrijf een voorbeeld van een veilig wachtwoord reset script"
    ]
  };

  shortcuts.innerHTML = "";
  prompts[tab].forEach(text => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.onclick = () => sendMessage(text);
    shortcuts.appendChild(btn);
  });
}

function toggleStealth() {
  chatContainer.classList.toggle("stealth");
}

button.addEventListener("click", () => {
  const prompt = input.value.trim();
  if (prompt) {
    sendMessage(prompt);
    input.value = "";
  }
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") button.click();
});

window.addEventListener("load", () => {
  loadHistory();
  switchTab("cyber");
});
