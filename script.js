const sizeButtons = document.getElementsByClassName("size-btn");
const displayButton = document.getElementById("display");
const fixedSizeRadio = document.getElementById("fixed-size");
const customSizeRadio = document.getElementById("custom-size");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const mainForm = document.getElementById("main-form");
const capture = document.getElementById("capture");
const widgetContainer = document.getElementsByClassName("OUTBRAIN")[0];
const widthLabel = document.getElementById("widthLabel");
const heightLabel = document.getElementById("heightLabel");
const placeholder = document.getElementsByClassName("placeholder")[0];
const autoRefresh = document.getElementById("autoRefresh");
const draftToggle = document.getElementById("draftToggle");
const widgetIDInput = document.getElementById("idInput");
const widgetLink = document.getElementById("linkInput");
const header = document.getElementById("header");
const draftHeaderSpan = document.getElementById("draftHeaderSpan");
const deleteWidgetID = document.getElementById("delete-widget-id");
const deleteDataSrc = document.getElementById("delete-data-src");

let widthToDisplay = 0;
let heightToDisplay = 0;
let isDisplayed = false;
let isFirstDraftChange = true;
let sessionStorageWidgetID;
let sessionStorageWidgetLink;

// Function to handle radio button change
function handleRadioChange() {
  if (fixedSizeRadio.checked) {
    widthInput.disabled = true;
    heightInput.disabled = true;
    addClassToElements(sizeButtons, "enabled");
    addClassToElements([widthInput, heightInput], "disabled");
  } else if (customSizeRadio.checked) {
    widthInput.disabled = false;
    heightInput.disabled = false;
    addClassToElements([widthInput, heightInput], "enabled");
    addClassToElements(sizeButtons, "disabled");
  } else {
    widthInput.disabled = true;
    heightInput.disabled = true;
    addClassToElements(sizeButtons, "disabled");
    addClassToElements([widthInput, heightInput], "disabled");
  }
}

// Helper function to add or remove class based on enabled state
function addClassToElements(elements, className) {
  for (let button of elements) {
    button.classList.remove("enabled", "disabled");
    button.classList.add(className);
  }
}

function handleDisplayClick(event) {
  event.preventDefault();
  console.log("change");
  if (
    isDisplayed &&
    widgetIDInput.value !== widgetContainer.attributes["data-widget-id"].value
  ) {
    swal({
      title: "Sorry...",
      text: "Please refresh the page in order to change widget ID",
      type: "error",
      confirmButtonText: "OK",
    });
  }

  console.log("form submitted");
  //   let validationFlag = true;

  if (customSizeRadio.checked) {
    if (widthToDisplay <= 0 || heightToDisplay <= 0) {
      //   validationFlag = false;
      swal({
        title: "Error!",
        text: "Both width & height must be > 0",
        type: "error",
        confirmButtonText: "OK",
      });
      return;
    }
  }
  //   if (validationFlag) {
  let tempWidth;
  let tempHeight;

  if (fixedSizeRadio.checked) {
    tempWidth = widthToDisplay;
    tempHeight = heightToDisplay;
  } else if (customSizeRadio.checked) {
    tempWidth = parseInt(widthInput.value, 10);
    tempHeight = parseInt(heightInput.value, 10);
  } else {
    tempWidth =
      parseFloat(window.getComputedStyle(capture.parentNode).width) * 0.8;
  }

  if (widgetContainer) {
    widgetContainer.style.width = tempWidth + "px";
    widgetContainer.style.height = tempHeight + "px";
  }

  placeholder.style.width = tempWidth + "px";
  placeholder.style.height = tempHeight + "px";

  widthLabel.textContent = `Width: ${tempWidth.toFixed(2)}px`;
  heightLabel.textContent = `Height: ${
    tempHeight ? tempHeight + "px" : "auto"
  }`;
  injectWidgetDiv();
  injectScript();

  isDisplayed = true;

  if (autoRefresh.checked) {
    logEvery30Seconds();
  }

  if (!document.getElementById("refresh")) {
    setTimeout(() => {
      const refreshBtn = document.createElement("button");
      refreshBtn.id = "refresh";
      refreshBtn.innerText = "Refresh";
      refreshBtn.addEventListener(
        "click",
        console.log(OBR.extern.refreshWidget())
      );
      displayButton.insertAdjacentElement("afterend", refreshBtn);
      displayButton.disabled = true;
      displayButton.classList.add("disabled");
    }, 3000);
  }

  const widgetID = document.getElementById("idInput").value;
  let widgetLink = document.getElementById("linkInput").value;
  saveDataToSessionStorage(widgetID, widgetLink);
}

// Add event listeners to radio buttons
document.querySelectorAll('input[name="container-size"]').forEach((radio) => {
  radio.addEventListener("change", handleRadioChange);
});

// Add event listeners to display button
mainForm.addEventListener("submit", handleDisplayClick);

// Add event listeners to size inputs
widthInput.addEventListener("change", () => {
  widthToDisplay = parseInt(widthInput.value, 10);
});
heightInput.addEventListener("change", () => {
  heightToDisplay = parseInt(heightInput.value, 10);
});

deleteWidgetID.addEventListener("click", handleDeleteWidgetIDClick);
deleteDataSrc.addEventListener("click", handleDeleteDataSrcClick);

// Inject values for size buttons
function handleSizeButtonsLoad() {
  for (let index = 0; index < sizeButtons.length; index++) {
    sizeButtons[index].addEventListener("click", handleSizeButtonClick);

    let intWidth = parseInt(
      sizeButtons[index].attributes["width-value"].value,
      10
    );
    let intHeight = parseInt(
      sizeButtons[index].attributes["height-value"].value,
      10
    );

    sizeButtons[index].innerText = intWidth + " x " + intHeight;
  }
}

function handleSizeButtonClick(event) {
  event.preventDefault();
  if (fixedSizeRadio.checked) {
    let btnArr = [...sizeButtons];
    btnArr.forEach((btn) => btn.classList.remove("selected"));
    widthToDisplay = parseInt(this.attributes["width-value"].value, 10);
    heightToDisplay = parseInt(this.attributes["height-value"].value, 10);
    this.classList.add("selected");
  }
}

console.log(document.querySelector("div.OUTBRAIN"));

autoRefresh.addEventListener("change", logEvery30Seconds);

function logEvery30Seconds() {
  const countdownParent = document.getElementsByClassName("countdown")[0];
  console.log(countdownParent);
  if (isDisplayed && autoRefresh.checked) {
    const countdownSpan = document.getElementById("countdown");
    const autoRefresh = document.getElementById("autoRefresh");
    let countdown = 30;

    countdownParent.classList.remove("hide");

    // Update the countdown every second
    setInterval(() => {
      if (countdown === 0) {
        countdown = 30; // Reset the countdown
      }
      countdownSpan.textContent = countdown; // Update the span with the current countdown
      countdown--;
    }, 1000);

    // Handle widget refresh every 30 seconds
    setInterval(() => {
      if (autoRefresh.checked) {
        console.log(OBR.extern.refreshWidget());
        const currentTime = new Date().toLocaleTimeString();
        console.log(`Widget refreshed at: ${currentTime}`);
      }
    }, 30000);
  } else {
    countdownParent.classList.add("hide");
  }
}

draftToggle.addEventListener("change", handleDraftToggleChange);

function handleDraftToggleChange() {
  if (!isFirstDraftChange) {
    header.classList.toggle("draftHeader");
    if (draftToggle.checked) {
      document.location.href =
        "https://matan-outbrain.github.io/Widget-Tester/?obdraft=true&testMode=true";
    } else {
      document.location.href =
        "https://matan-outbrain.github.io/Widget-Tester/?testMode=true";
    }
  }
}

function checkDraftState() {
  if (window.location.href.indexOf("obdraft") > -1) {
    header.classList.toggle("draftHeader");
    draftHeaderSpan.style.display = "inline";
    draftToggle.checked = true;
  }
  isFirstDraftChange = false;
}

function forceTestModeOnURL() {
  console.log(document.location.href);
  if (
    document.location.href === "https://matan-outbrain.github.io/Widget-Tester/"
  ) {
    document.location.href =
      "https://matan-outbrain.github.io/Widget-Tester/?testMode=true";
  }

  if (
    document.location.href ===
    "https://matan-outbrain.github.io/Widget-Tester/?obdraft=true"
  ) {
    document.location.href =
      "https://matan-outbrain.github.io/Widget-Tester/?obdraft=true&testMode=true";
  }
}

function saveDataToSessionStorage(widgetID, widgetLink) {
  sessionStorage.setItem("widget_id", widgetID);
  sessionStorage.setItem("widget_link", widgetLink);
}

function getDataFromSessionStorage() {
  sessionStorageWidgetID = sessionStorage.getItem("widget_id");
  sessionStorageWidgetLink = sessionStorage.getItem("widget_link");
}

function handleInputData() {
  getDataFromSessionStorage();
  if (sessionStorageWidgetID) {
    widgetIDInput.value = sessionStorageWidgetID;
    deleteWidgetID.classList.toggle("show");
  }
  if (sessionStorageWidgetLink) {
    widgetLink.value = sessionStorageWidgetLink;
    deleteDataSrc.classList.toggle("show");
  }
}

function handleDeleteWidgetIDClick() {
  widgetIDInput.value = null;
  deleteWidgetID.classList.toggle("show");
  sessionStorage.removeItem("widget_id");
}

function handleDeleteDataSrcClick() {
  widgetLink.value = null;
  deleteDataSrc.classList.toggle("show");
  sessionStorage.removeItem("widget_link");
}

function injectScript() {
  // remove the current script if it exists
  if (document.contains(document.getElementById("obScript"))) {
    document.getElementById("obScript").remove();
  }
  const script = document.createElement("script");
  script.id = "obScript";
  script.type = "text/javascript"; // set the type (optional because it's the default)
  script.async = true; // set async attribute
  script.src = "//widgets.outbrain.com/outbrain.js"; // set the source

  document.head.appendChild(script);
}

function injectWidgetDiv() {
  // remove the current widget div if it exists
  if (document.contains(document.getElementById("widget"))) {
    document.getElementById("widget").remove();
  }
  const div = document.createElement("div");
  div.id = "widget";
  div.classList.add("OUTBRAIN");
  div.dataset.src = document.getElementById("linkInput").value;
  div.dataset.widgetId = document.getElementById("idInput").value;

  capture.insertAdjacentElement("beforeend", div);
}

// Initialize state on page load
forceTestModeOnURL();
checkDraftState();
handleRadioChange();
handleSizeButtonsLoad();
handleInputData();
