import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [hasAllUrlsPermission, setHasAllUrlsPermission] = useState(false)

  // On initial render, check if extension has all permissions
  useEffect(() => {
    chrome.permissions.contains({ origins: ["<all_urls>"] }, result => {
      setHasAllUrlsPermission(result)
    });
  }, []);

// Allow access to all URLs    
function allow() {
  chrome.permissions.request({
      origins: ["<all_urls>"]
  }, function(granted) {
      if (granted) {
        setHasAllUrlsPermission(true)
      }
  });
}

  return (
    <div>
      <h1>Welcome to GutCheck</h1>
      <h2>The human-run misinformation reporter</h2>
      { !hasAllUrlsPermission && 
        <>
          <br />
          <p>
            For this extension to work properly, you must
            <br />
            <button className='manip-button' onClick={allow}>Allow access to all websites</button>
          </p>
          <br />
        </>
      }
      <p>
        To get started, open up the GutCheck extension by clicking on the puzzle piece in the top-right corner.
      </p>
    </div>
  )
}

export default App
