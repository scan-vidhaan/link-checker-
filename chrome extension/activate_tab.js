// Function to check if the URL starts with HTTPS or other secure protocols
function checkSSL(url) {
  return url.toLowerCase().startsWith('https://') || url.toLowerCase().startsWith('wss://') || url.toLowerCase().startsWith('ftp://');
}

// Function to check for common phishing keywords in URL
function checkPhishingKeywords(url) {
  var phishingKeywords = [
    'phishing', 'fraud', 'scam', 'spoof', 'phish', 'hijack', 'fraudulent', 'deceptive',
    'identity-theft', 'credential-stealing', 'pharming', 'suspicious-activity', 'unauthorized-access',
    'security-alert', 'account-update', 'login-attempt', 'verification-needed', 'suspicious-login',
    'fraud-alert', 'identity-verification', 'account-security', 'unusual-activity', 'data-theft',
    'cyber-attack', 'malicious-activity', 'phishing-attempt', 'phishing-scam', 'phishing-fraud','ngrok',
    // Add more specific phishing-related keywords as needed
  ];

  for (var i = 0; i < phishingKeywords.length; i++) {
    if (url.toLowerCase().includes(phishingKeywords[i])) {
      return true; // URL contains a phishing keyword
    }
  }
  return false; // URL does not contain phishing keywords
}

// Simulate redirects by delaying callback execution
function simulateRedirects(url, callback) {
  setTimeout(function() {
    var hasExcessiveRedirects = url.length > 100; // Simulate excessive redirects if URL length exceeds a threshold
    callback(hasExcessiveRedirects);
  }, 1000); // Simulate redirects after a delay of 1000ms (1 second)
}

// Function to check for executable file types in URL
function checkExecutable(url) {
  var executableFileTypes = ['.exe', '.msi', '.bat', '.jar', '.zip', '.php', '.html', '.js', '.vbs', '.cmd','.apk','.mp4']; // Updated list of executable file types

  for (var i = 0; i < executableFileTypes.length; i++) {
    if (url.toLowerCase().endsWith(executableFileTypes[i])) {
      return true; // URL ends with an executable file type
    }
  }
  return false; // URL does not end with an executable file type
}

// Function to check for single IPv4 address in URL
function checkForSingleIP(url) {
  // Split the URL by dots
  var parts = url.split('.');

  // Check if the URL contains exactly 4 parts
  if (parts.length !== 4) {
    return null; // Invalid IPv4 format
  }

  // Check if each part is a valid octet (number between 0 and 255)
  for (var i = 0; i < parts.length; i++) {
    var octet = parseInt(parts[i], 10); // Convert part to integer base 10

    if (isNaN(octet) || octet < 0 || octet > 255) {
      return null; // Invalid octet
    }
  }

  // Return the IPv4 address if all parts are valid octets
  return parts.join('.');
}

// Function to check if the URL has an unusual length
function checkUnusualLength(url) {
  // Define the threshold for unusual length
  var unusualLengthThreshold = 1000;

  // Check if the URL length exceeds the threshold
  if (url.length > unusualLengthThreshold) {
    return true; // URL has unusual length
  }
  return false; // URL length is within normal range
}

// Function to check if the URL has an unusually small length or an unfamiliar shortening source
function unusuallySmallLink(url) {
  // Define the threshold for unusually small length
  var unusuallyShortLengthThreshold = 5;

  // List of reputable URL shortening services
  var reputableShorteningServices = ['bit.ly', 'tinyurl.com', 't.co']; // Add more if needed

  // Extract the domain from the URL
  var domain = new URL(url).hostname.toLowerCase();

  // Check if the URL is unusually short
  if (url.length < unusuallyShortLengthThreshold) {
    if (reputableShorteningServices.includes(domain)) {
      return 'safe (unusually short but reputable)';
    } else {
      return 'unsafe (unusually short and unfamiliar source)';
    }
  }

  // Check if the shortening source is unfamiliar
  if (!reputableShorteningServices.includes(domain)) {
    return 'unsafe (unfamiliar shortening source)';
  }

  return 'normal'; // URL length and shortening source are normal
}

// Function to check for unusual activity related to ports
function checkPortActivity(url) {
  // Regular expression pattern to match port numbers in URLs
  var portPattern = /:\d{1,5}\//; // Matches a colon followed by 1 to 5 digits and then a slash

  // Check if the URL contains port-related information
  if (portPattern.test(url)) {
    return 'unsafe (port-related activity detected)';
  }

  return 'normal'; // No port-related activity detected
}

// Function to update the image based on link safety
function updateImage(isSafe) {
  var safeImage = document.getElementById('safeImage');
  var unsafeImage = document.getElementById('unsafeImage');

  if (isSafe) {
    safeImage.style.display = 'none'; // Display happy dog image
    unsafeImage.style.display = 'block'; // Hide sad dog image
  } else {
    safeImage.style.display = 'block'; // Hide happy dog image
    unsafeImage.style.display = 'none '; // Display sad dog image
  }
}

// Function to check the active tab for potential malicious activity
function checkActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var url = tabs[0].url;

    // Check if the URL starts with HTTPS or other secure protocols
    var hasSSL = checkSSL(url);

    // Check for common phishing keywords in URL
    var isPhishing = checkPhishingKeywords(url);

    // Check if the URL redirects excessively
    simulateRedirects(url, function(hasExcessiveRedirects) {
      // Check for executable file types in URL
      var hasExecutable = checkExecutable(url);

      // Check for single IPv4 address in URL
      var singleIP = checkForSingleIP(url);

      // Check for unusual URL length
      var hasUnusualLength = checkUnusualLength(url);

      // Check for unusual activity related to ports
      var portActivityStatus = checkPortActivity(url);

      // Check for unusually small link
      var unusualLinkStatus = unusuallySmallLink(url);

      var isMalicious = '';

      if (isPhishing) {
        isMalicious = 'This link is flagged as a potential phishing link.';
      } else if (!hasSSL) {
        isMalicious = 'This link is not served over a secure channel (HTTPS).';
      } else if (hasExcessiveRedirects) {
        isMalicious = 'This link has too many redirects, indicating potential unsafe activity.';
      } else if (hasExecutable) {
        isMalicious = 'This link is attempting to download an unusual or potentially harmful file.';
      } else if (singleIP !== null) {
        isMalicious = 'This link contains an IPv4 address, which can be a sign of a malicious link.';
      } else if (hasUnusualLength) {
        isMalicious = 'This link has an unusually long length, which can be a red flag for potential threats.';
      } else if (portActivityStatus === 'unsafe (port-related activity detected)') {
        isMalicious = 'This link is associated with port-related activity, suggesting potential risks.';
      } else if (unusualLinkStatus === 'unsafe (unusually small and unfamiliar source)') {
        isMalicious = 'This link is unusually small and from an unfamiliar source, raising safety concerns.';
      } else {
        isMalicious = 'This link seems safe.';
      }

      // Update the result message in the HTML element
      var resultElement = document.getElementById('result');
      resultElement.textContent = isMalicious;
      console.log(isMalicious.includes('unsafe') ? 'danger' : 'safe');

      // Update the image based on link safety
      updateImage(isMalicious.includes('unsafe'));
    });
  });
}

// Attach click event listener to the button
document.addEventListener('DOMContentLoaded', function() {
  var checkButton = document.getElementById('checkButton');
  checkButton.addEventListener('click', checkActiveTab);
});
