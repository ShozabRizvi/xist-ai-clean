document.getElementById('scanBtn').addEventListener('click', async () => {
  const input = document.getElementById('scanInput').value;
  const resultDiv = document.getElementById('result');
  if (!input) return;

  resultDiv.innerHTML = "Scanning securely via Xist AI Engine...";

  try {
    // Replace this URL with your actual live backend URL (e.g., https://your-app.onrender.com/api/triage)
    const response = await fetch("https://xist-ai-clean-1.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input })
    });

    const data = await response.json();
    
    // Displays the safe response from your backend
    resultDiv.innerHTML = data.solution || data.error; 
    
  } catch (error) {
    resultDiv.innerHTML = "Error connecting to Xist AI Engine.";
  }
});