// Connect to the background script
const port = chrome.runtime.connect({ name: 'content-script' });

// Listen for messages from the background script
port.onMessage.addListener(function (response) {
  if (response && response.hasPosts !== undefined) {
    const hasPosts = response.hasPosts;

    if (hasPosts) {
      alert("Message from GutCheck:\n\n\nThis website has GutChecks. Open up the GutCheck Chrome Extension for details!");
    }
  } else {
    console.error("Error: Unexpected response format", response);
  }
});

// Request data from the background script
const url = document.location.href
port.postMessage({ msg: 'new tab', url: url });
