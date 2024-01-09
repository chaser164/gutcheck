//Listen for extension being installed
chrome.runtime.onInstalled.addListener(install => {
  if(install.reason == 'install'){
    //Open the configuration page
    chrome.tabs.create({
      url: '/welcome/welcome.html'
    });
  };
});

// Listen for connections from content scripts
chrome.runtime.onConnect.addListener(function (port) {
    if (port.name === 'content-script') {
      // Handle messages from the content script
      port.onMessage.addListener(async function (request) {
        if (request && request.msg === 'new tab') {
          try {
            const apiUrl = "https://gutcheck-chaser164.pythonanywhere.com/api/v1/posts/has-posts/";
  
            const response = await fetch(apiUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ website: request.url }),
            });
            if (response.ok) {
              const responseData = await response.json();
              const hasPosts = responseData.has_posts || false;
              // Send the response back to the content script
              port.postMessage({ hasPosts: hasPosts });
            } else {
              console.error("Error:", response.status, response.statusText);
              port.postMessage({ hasPosts: false });
            }
          } catch (error) {
            console.error("Error:", error);
            port.postMessage({ hasPosts: false });
          }
        }
      });
    }
});
  