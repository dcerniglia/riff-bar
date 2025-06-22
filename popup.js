// Guitar Effects Pedal Popup JavaScript for RiffBar extension

document.addEventListener('DOMContentLoaded', function() {
  const stompSwitch = document.getElementById('enableToggle');
  const resetBtn = document.getElementById('resetPosition');
  const refreshBtn = document.getElementById('refreshPage');
  const largeKnobs = document.querySelectorAll('.large-knob');
  const powerLed = document.getElementById('powerLed');
  const activeLed = document.getElementById('activeLed');
  
  // Settings storage
  const settings = {
    jumpInterval1: 30,
    button1Speed: 1,
    jumpInterval2: 30,
    button2Speed: 0.5
  };

  // Load current settings first, then update displays
  loadSettings();

  // Event listeners
  stompSwitch.addEventListener('click', handleStompSwitch);
  resetBtn.addEventListener('click', resetPosition);
  refreshBtn.addEventListener('click', refreshCurrentPage);
  
  // Add knob interactions
  largeKnobs.forEach(knob => {
    knob.addEventListener('click', handleKnobClick);
    knob.addEventListener('wheel', handleKnobWheel, { passive: false });
    
    // Add tactile feedback
    knob.addEventListener('mousedown', () => {
      knob.style.transform = 'scale(0.95)';
    });
    
    knob.addEventListener('mouseup', () => {
      knob.style.transform = '';
    });
    
    knob.addEventListener('mouseleave', () => {
      knob.style.transform = '';
    });
  });

  function loadSettings() {
    chrome.storage.local.get(['isEnabled', 'guitarSettings'], (result) => {
      const isEnabled = result.isEnabled !== false; // Default to true
      updatePedalState(isEnabled);
      
      // Load guitar settings
      const defaultGuitarSettings = {
        jumpInterval1: 30,
        button1Speed: 1,
        jumpInterval2: 30,
        button2Speed: 0.5
      };
      
      const guitarSettings = result.guitarSettings || defaultGuitarSettings;
      console.log('Loaded guitar settings:', guitarSettings);
      Object.assign(settings, guitarSettings);
      console.log('Final settings object:', settings);
      
      // Update displays immediately after settings are loaded
      updateAllKnobDisplays();
    });
  }

  function updatePedalState(isEnabled) {
    // Update stomp switch
    if (isEnabled) {
      stompSwitch.classList.add('active');
      stompSwitch.classList.add('pressed');
      setTimeout(() => stompSwitch.classList.remove('pressed'), 100);
    } else {
      stompSwitch.classList.remove('active');
    }
    
    // Update LED indicators
    const powerLedLight = powerLed.querySelector('.led-light');
    const activeLedLight = activeLed.querySelector('.led-light');
    
    if (isEnabled) {
      powerLedLight.classList.add('active');
      activeLedLight.classList.add('active');
    } else {
      powerLedLight.classList.remove('active');
      activeLedLight.classList.remove('active');
    }
  }

  function handleStompSwitch() {
    const isCurrentlyActive = stompSwitch.classList.contains('active');
    const newState = !isCurrentlyActive;
    
    // Add stomp animation
    stompSwitch.classList.add('pressed');
    setTimeout(() => stompSwitch.classList.remove('pressed'), 150);
    
    updatePedalState(newState);
    
    chrome.storage.local.set({ isEnabled: newState }, () => {
      // Send message to content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url && tabs[0].url.includes('youtube.com')) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'toggleControlBar',
            enabled: newState
          }).catch(err => {
            console.log('Message send error:', err);
          });
        }
      });
    });
  }

  function handleKnobClick(event) {
    const knob = event.currentTarget;
    const setting = knob.dataset.setting;
    
    // Cycle through values on click
    switch (setting) {
      case 'jumpInterval1':
        const jumpValues = [5, 10, 15, 30, 45, 60, 120];
        const currentJumpIndex = jumpValues.indexOf(settings.jumpInterval1);
        settings.jumpInterval1 = jumpValues[(currentJumpIndex + 1) % jumpValues.length];
        break;
        
      case 'button1Speed':
        const speed1Values = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
        const currentSpeed1Index = speed1Values.indexOf(settings.button1Speed);
        settings.button1Speed = speed1Values[(currentSpeed1Index + 1) % speed1Values.length];
        break;
        
      case 'jumpInterval2':
        const jumpValues2 = [5, 10, 15, 30, 45, 60, 120];
        const currentJumpIndex2 = jumpValues2.indexOf(settings.jumpInterval2);
        settings.jumpInterval2 = jumpValues2[(currentJumpIndex2 + 1) % jumpValues2.length];
        break;
        
      case 'button2Speed':
        const speed2Values = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
        const currentSpeed2Index = speed2Values.indexOf(settings.button2Speed);
        settings.button2Speed = speed2Values[(currentSpeed2Index + 1) % speed2Values.length];
        break;
    }
    
    updateKnobDisplay(setting);
    updateKnobRotation(knob, setting);
    saveSettings();
  }

  function handleKnobWheel(event) {
    event.preventDefault();
    const knob = event.currentTarget;
    const setting = knob.dataset.setting;
    const delta = event.deltaY > 0 ? -1 : 1;
    
    switch (setting) {
      case 'jumpInterval1':
        settings.jumpInterval1 = Math.max(5, Math.min(120, settings.jumpInterval1 + delta * 5));
        break;
        
      case 'button1Speed':
        const speed1Values = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
        const currentSpeed1Index = speed1Values.indexOf(settings.button1Speed);
        const newSpeed1Index = Math.max(0, Math.min(speed1Values.length - 1, currentSpeed1Index + delta));
        settings.button1Speed = speed1Values[newSpeed1Index];
        break;
        
      case 'jumpInterval2':
        settings.jumpInterval2 = Math.max(5, Math.min(120, settings.jumpInterval2 + delta * 5));
        break;
        
      case 'button2Speed':
        const speed2Values = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
        const currentSpeed2Index = speed2Values.indexOf(settings.button2Speed);
        const newSpeed2Index = Math.max(0, Math.min(speed2Values.length - 1, currentSpeed2Index + delta));
        settings.button2Speed = speed2Values[newSpeed2Index];
        break;
    }
    
    updateKnobDisplay(setting);
    updateKnobRotation(knob, setting);
    saveSettings();
  }

  function updateKnobDisplay(setting) {
    let displayValue = '';
    let elementId = '';
    
    switch (setting) {
      case 'jumpInterval1':
        displayValue = `${settings.jumpInterval1 || 30}s`;
        elementId = 'jump1Value';
        break;
      case 'button1Speed':
        const speed1 = settings.button1Speed || 1;
        displayValue = `${speed1}x`;
        elementId = 'speed1Value';
        break;
      case 'jumpInterval2':
        displayValue = `${settings.jumpInterval2 || 30}s`;
        elementId = 'jump2Value';
        break;
      case 'button2Speed':
        const speed2 = settings.button2Speed || 0.5;
        displayValue = `${speed2}x`;
        elementId = 'speed2Value';
        break;
    }
    
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = displayValue;
      
      // Add brief highlight effect only when not during initial load
      if (setting !== 'initial_load') {
        element.style.background = 'rgba(255, 255, 255, 0.2)';
        setTimeout(() => {
          element.style.background = '';
        }, 200);
      }
    } else {
      console.warn(`Element with ID '${elementId}' not found for setting '${setting}'`);
    }
  }

  function updateKnobRotation(knob, setting) {
    const indicatorGroup = knob.querySelector('.knob-indicator-group');
    if (!indicatorGroup) return;
    
    let rotation = 0;
    
    switch (setting) {
      case 'jumpInterval1':
        // Map 5-120 to -135 to 135 degrees
        rotation = ((settings.jumpInterval1 - 5) / (120 - 5)) * 270 - 135;
        break;
      case 'button1Speed':
        // Map 0.25-2 to -135 to 135 degrees
        rotation = ((settings.button1Speed - 0.25) / (2 - 0.25)) * 270 - 135;
        break;
      case 'jumpInterval2':
        // Map 5-120 to -135 to 135 degrees
        rotation = ((settings.jumpInterval2 - 5) / (120 - 5)) * 270 - 135;
        break;
      case 'button2Speed':
        // Map 0.25-2 to -135 to 135 degrees
        rotation = ((settings.button2Speed - 0.25) / (2 - 0.25)) * 270 - 135;
        break;
    }
    
    indicatorGroup.style.transform = `rotate(${rotation}deg)`;
  }

  function updateAllKnobDisplays() {
    updateKnobDisplay('jumpInterval1');
    updateKnobDisplay('button1Speed');
    updateKnobDisplay('jumpInterval2');
    updateKnobDisplay('button2Speed');
    
    // Update knob rotations
    largeKnobs.forEach(knob => {
      updateKnobRotation(knob, knob.dataset.setting);
    });
  }

  function saveSettings() {
    const guitarSettings = {
      jumpInterval1: settings.jumpInterval1,
      button1Speed: settings.button1Speed,
      jumpInterval2: settings.jumpInterval2,
      button2Speed: settings.button2Speed
    };
    
    // Update hidden inputs for compatibility
    const jumpInput1 = document.getElementById('jumpInterval1');
    const speed1Input = document.getElementById('button1Speed');
    const jumpInput2 = document.getElementById('jumpInterval2');
    const speed2Input = document.getElementById('button2Speed');
    
    if (jumpInput1) jumpInput1.value = settings.jumpInterval1;
    if (speed1Input) speed1Input.value = settings.button1Speed;
    if (jumpInput2) jumpInput2.value = settings.jumpInterval2;
    if (speed2Input) speed2Input.value = settings.button2Speed;
    
    chrome.storage.local.set({ guitarSettings }, () => {
      // Send message to content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url && tabs[0].url.includes('youtube.com')) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'updateGuitarSettings',
            settings: guitarSettings
          }).catch(err => {
            console.log('Message send error:', err);
          });
        }
      });
    });
  }

  function resetPosition() {
    const defaultPosition = { left: 20, top: 20 };
    
    chrome.storage.local.set({ controlBarPosition: defaultPosition }, () => {
      // Send message to content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url && tabs[0].url.includes('youtube.com')) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'resetPosition',
            position: defaultPosition
          }).catch(err => {
            console.log('Message send error:', err);
          });
        }
      });
      
      // Visual feedback with pedal-style animation
      const originalText = resetBtn.querySelector('.button-text').textContent;
      resetBtn.querySelector('.button-text').textContent = 'RESET!';
      resetBtn.style.background = 'linear-gradient(145deg, #00ff00, #00cc00)';
      resetBtn.style.borderColor = '#00aa00';
      
      setTimeout(() => {
        resetBtn.querySelector('.button-text').textContent = originalText;
        resetBtn.style.background = '';
        resetBtn.style.borderColor = '';
      }, 1000);
    });
  }

  function refreshCurrentPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        // Visual feedback
        const originalText = refreshBtn.querySelector('.button-text').textContent;
        refreshBtn.querySelector('.button-text').textContent = 'REFRESH!';
        
        setTimeout(() => {
          chrome.tabs.reload(tabs[0].id);
          window.close();
        }, 300);
      }
    });
  }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'settingsChanged') {
    loadSettings();
  }
}); 