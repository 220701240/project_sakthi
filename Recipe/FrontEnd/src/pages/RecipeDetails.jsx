import React, { useState, useEffect } from "react";

const RecipeDetails = ({ recipe }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);

  // Example steps (replace with actual recipe steps)
  const steps = [
    "Boil water in a pot.",
    "Add spaghetti and cook for 10 minutes.",
    "Drain the water and mix with sauce.",
    "Serve hot and enjoy!",
  ];

  useEffect(() => {
    if (isListening) {
      startVoiceRecognition();
    }
  }, [isListening]);

  // Function to move to the next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      speak(steps[currentStep + 1]); // Read the next step aloud
    }
  };

  // Function to move to the previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      speak(steps[currentStep - 1]); // Read the previous step aloud
    }
  };

  // Function to repeat the current step
  const repeatStep = () => {
    speak(steps[currentStep]);
  };

  // Function to start voice recognition
  const startVoiceRecognition = () => {
    const recognition = new window.SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("User said:", transcript);

      if (transcript.includes("next step")) {
        nextStep();
      } else if (transcript.includes("go back")) {
        prevStep();
      } else if (transcript.includes("repeat")) {
        repeatStep();
      } else if (transcript.includes("stop listening")) {
        setIsListening(false);
        recognition.stop();
      }
    };

    recognition.start();
  };

  // Function to convert text to speech
  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  return (
    <div className="container">
      <h2>{recipe.name}</h2>
      <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
      <p><strong>Meal Type:</strong> {recipe.mealType}</p>

      <div className="recipe-steps">
        <h3>Step {currentStep + 1}:</h3>
        <p>{steps[currentStep]}</p>
      </div>

      <div className="controls">
        <button onClick={prevStep} disabled={currentStep === 0}>Previous</button>
        <button onClick={nextStep} disabled={currentStep === steps.length - 1}>Next</button>
        <button onClick={repeatStep}>Repeat</button>
        <button onClick={() => setIsListening(!isListening)}>
          {isListening ? "Stop Listening" : "Start Voice Control"}
        </button>
      </div>
    </div>
  );
};

export default RecipeDetails;
