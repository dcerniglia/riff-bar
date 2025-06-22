// Background service worker for RiffBar extension

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('RiffBar extension installed');
    
    // Set default settings
    chrome.storage.local.set({
      controlBarPosition: { left: 20, top: 20 },
      isEnabled: true,
      guitarSettings: {
        jumpInterval1: 30,
        button1Speed: 1,
        jumpInterval2: 30,
        button2Speed: 0.5
      }
    });
  }
});

// Content script is automatically injected via manifest.json
// No manual injection needed

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'getSettings':
      chrome.storage.local.get(['isEnabled', 'controlBarPosition'], (result) => {
        sendResponse(result);
      });
      return true; // Keep message channel open for async response
      
    case 'saveSettings':
      chrome.storage.local.set(request.settings, () => {
        sendResponse({ success: true });
      });
      return true;
      
    case 'toggleExtension':
      chrome.storage.local.get(['isEnabled'], (result) => {
        const newState = !result.isEnabled;
        chrome.storage.local.set({ isEnabled: newState }, () => {
          sendResponse({ isEnabled: newState });
        });
      });
      return true;
      
    default:
      sendResponse({ error: 'Unknown action' });
  }
}); 