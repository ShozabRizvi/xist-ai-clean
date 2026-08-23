document.getElementById('scanBtn').addEventListener('click', async () => {
    const input = document.getElementById('scanInput').value;
    const resultDiv = document.getElementById('result');
    
    if (!input) {
        resultDiv.innerHTML = "<span style='color: #ef4444;'>Please enter text to scan.</span>";
        return;
    }

    resultDiv.innerHTML = "Scanning with Xist AI Core...";
    
    try {
        // Calls your LIVE Python backend!
        const response = await fetch('https://xist-ai-clean-1.onrender.com/api/v1/public/scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // You can hardcode a free extension API key here
                'X-Xist-API-Key': 'xist_live_extension_key_123' 
            },
            body: JSON.stringify({
                mode: input.startsWith('http') ? 'url' : 'text',
                text: input
            })
        });

        const data = await response.json();
        
        // Display the results in the tiny window
        const riskColor = data.results.risk_score > 60 ? '#ef4444' : '#10b981';
        resultDiv.innerHTML = `
            <div style="padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid ${riskColor}33;">
                <strong style="color: ${riskColor}; text-transform: uppercase;">Verdict: ${data.results.verdict}</strong><br/>
                <span style="opacity: 0.8;">Risk Score: ${data.results.risk_score}%</span>
            </div>
        `;
    } catch (error) {
        resultDiv.innerHTML = "<span style='color: #ef4444;'>Engine offline. Try again later.</span>";
    }
});