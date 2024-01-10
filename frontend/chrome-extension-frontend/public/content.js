// Connect to the background script
const port = chrome.runtime.connect({ name: 'content-script' });

// Listen for messages from the background script
port.onMessage.addListener(function (response) {
  if (response && response.hasPosts !== undefined) {
    const hasPosts = response.hasPosts;

    if (hasPosts) {
      alert("Message from GutCheck:\n\n\nThis website has GutChecks. Open up the GutCheck Chrome Extension for details!");
    }
  } 
});

// Request data from the background script


// Check if user has alerts enabled
let hasAlerts;

chrome.storage.sync.get('hasAlerts', function (result) {
  if (chrome.runtime.lastError) {
    // Handle errors, if any
    console.error(chrome.runtime.lastError);
    // Default to true if not found or an error occurs
    hasAlerts = true;
  } else {
    // Use the retrieved value or default to true if not found
    hasAlerts = result.hasAlerts !== undefined ? result.hasAlerts : true;
  }

  // If the user has alerts enabled, trigger a potential alert
  if (hasAlerts) {
    const url = document.location.href
    port.postMessage({ msg: 'new tab', url: url });

  }
});


