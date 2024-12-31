const userInfo = {
  userAgent: navigator.userAgent,
  language: navigator.language,
  screenResolution: `${screen.width}x${screen.height}`,
  referrer: document.referrer,
  currentPage: window.location.href,
  timeVisited: new Date().toISOString(),
};

// Convert the userInfo object to JSON
const data = JSON.stringify(userInfo);

// Create a new XMLHttpRequest object
const xhr = new XMLHttpRequest();

// Replace with your Google Apps Script URL or endpoint
const url =
  "https://script.google.com/a/macros/outbrain.com/s/AKfycbyGeGvxKS62MW-vqcVMdil9bFVFB8Mkf_MvazBaKHva2Nb-LUEg1d4D1EPX4hWSnz57/exec";

// Configure the request
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-Type", "application/json");

// Add a callback for the response
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log("Data sent successfully:", xhr.responseText);
    } else {
      console.error("Error sending data:", xhr.status, xhr.statusText);
    }
  }
};

// Send the request
xhr.send(data);
