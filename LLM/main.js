async function send(params) {
    
}async function sendMessage(prompt) {
    const url = "http://localhost:11434/api/generate";
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "phi3",
            prompt: prompt,
            stream: false
        })
    };
    
    const response = await fetch(url, options);
    const data = await response.json();
    //debug; console.log(data.response);

    const ul = document.querySelector("ul");
    const li = document.createElement("li");
    li.textContent = data.response;
    ul.appendChild(li);
}

const input = document.getElementById("llm__input");
const button = document.getElementById("llm__button");

button.addEventListener("click", () => {
    const prompt = input.value.trim();
    if (prompt) {
        sendMessage(prompt);
        input.value = ""; // clr
    }
});