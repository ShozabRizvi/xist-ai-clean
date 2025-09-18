class VoiceCommandSystem {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.currentLanguage = 'en-US';
    this.commandHistory = [];
    this.wakeWords = ['vanta', 'jarvis', 'assistant'];
    this.voiceSettings = {
      rate: 0.8,
      pitch: 0.9,
      volume: 0.8
    };
  }

  checkBrowserSupport() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  async startListening() {
    if (!this.checkBrowserSupport()) {
      this.speak("Speech recognition not supported in this browser.");
      return false;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.currentLanguage;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.speak("Voice command system activated. How may I assist you?");
      };

      this.recognition.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          this.processVoiceInput(lastResult[0].transcript, lastResult[0].confidence);
        }
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.speak("I'm sorry, I encountered an error. Please try again.");
      };

      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Speech recognition error:', error);
      this.speak("Unable to start voice recognition. Please check your microphone.");
      return false;
    }
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
      this.isListening = false;
      this.speak("Voice command system deactivated.");
    }
  }

  async processVoiceInput(transcript, confidence) {
    const command = {
      transcript: transcript.toLowerCase().trim(),
      confidence,
      timestamp: new Date(),
      processed: false
    };

    this.commandHistory.unshift(command);
    if (this.commandHistory.length > 50) {
      this.commandHistory.pop();
    }

    // Process the command with Jarvis-like responses
    this.executeCommand(command);
  }

  executeCommand(command) {
    const text = command.transcript.toLowerCase();
    
    // Security Analysis Commands
    if (text.includes('scan') || text.includes('analyze') || text.includes('check')) {
      this.speak("Initiating security analysis. Please provide the content you want me to examine.");
      return;
    }
    
    // Navigation Commands
    if (text.includes('go to') || text.includes('navigate to') || text.includes('open')) {
      if (text.includes('home')) {
        this.speak("Navigating to home section.");
        window.dispatchEvent(new CustomEvent('voiceNavigate', { detail: 'home' }));
      } else if (text.includes('analytics')) {
        this.speak("Opening analytics dashboard.");
        window.dispatchEvent(new CustomEvent('voiceNavigate', { detail: 'analytics' }));
      } else if (text.includes('settings')) {
        this.speak("Accessing system settings.");
        window.dispatchEvent(new CustomEvent('voiceNavigate', { detail: 'settings' }));
      }
      return;
    }

    // System Status
    if (text.includes('status') || text.includes('report')) {
      this.speak("All systems operational. Security protocols active. Standing by for further instructions.");
      return;
    }

    // Help Commands
    if (text.includes('help') || text.includes('what can you do')) {
      this.speak("I can help you with security analysis, navigation, system status, and threat detection. Simply speak your command and I will assist you.");
      return;
    }

    // Shutdown Commands
    if (text.includes('stop') || text.includes('quiet') || text.includes('deactivate')) {
      this.stopListening();
      return;
    }

    // Greeting Responses
    if (text.includes('hello') || text.includes('hi vanta') || text.includes('good morning')) {
      this.speak("Hello. Vanta AI at your service. How may I protect you today?");
      return;
    }

    // Default response for unrecognized commands
    this.speak("Command not recognized. Please try again or say 'help' for available commands.");
  }

  speak(text) {
    if (this.synthesis && text) {
      // Cancel any ongoing speech
      this.synthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = this.voiceSettings.rate;
      utterance.pitch = this.voiceSettings.pitch;
      utterance.volume = this.voiceSettings.volume;
      
      // Try to use a more robotic/AI voice if available
      const voices = this.synthesis.getVoices();
      const preferredVoices = voices.filter(voice => 
        voice.name.includes('Microsoft') || 
        voice.name.includes('Google') ||
        voice.name.includes('Enhanced')
      );
      
      if (preferredVoices.length > 0) {
        utterance.voice = preferredVoices[0];
      }
      
      this.synthesis.speak(utterance);
    }
  }

  getCommandHistory() {
    return this.commandHistory;
  }

  updateVoiceSettings(settings) {
    this.voiceSettings = { ...this.voiceSettings, ...settings };
  }

  setWakeWord(enabled) {
    // Implementation for wake word functionality
    console.log(`Wake word ${enabled ? 'enabled' : 'disabled'}`);
  }
}

export const voiceCommandSystem = new VoiceCommandSystem();
export default voiceCommandSystem;
