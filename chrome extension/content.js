// Function to send message to background script
function sendMessageToBackground(url) {
    chrome.runtime.sendMessage({ action: "checkLink", url: url }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError.message);
        return;
      }
      // Update UI based on response (replace with your UI logic)
      const resultElement = document.getElementById("link-result");
      if (resultElement) {
        resultElement.textContent = response.message;
      }
    });
  }
  
  // Identify links on the page (replace with your specific logic)
  const links = document.querySelectorAll("a");
  
  // Attach click event listener to links
  links.forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default link behavior (optional)
      sendMessageToBackground(link.href);
    });
  });
  