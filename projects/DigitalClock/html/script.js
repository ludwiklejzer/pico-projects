const clockElement = document.querySelector("#time");
const modeToggle = document.querySelector("#mode-toggle");
const clockTypeSelector = document.querySelector("#clock-type-selector");
const darkModeToggle = document.querySelector("#dark-mode-toggle");
const fullscreenModeToggle = document.querySelector("#fullscreen-mode-toggle");
const html = document.querySelector("html");

function showElementsOnMouseMove() {
  let timeoutId;

  document.addEventListener("mousemove", function () {
    resetTimeout();
  });

  function onTimeout() {
    modeToggle.style.opacity = "0";
    clockTypeSelector.style.opacity = "0";
  }

  function resetTimeout() {
    modeToggle.style.opacity = "1";
    clockTypeSelector.style.opacity = "1";
    clearTimeout(timeoutId);
    timeoutId = setTimeout(onTimeout, 3000);
  }

  resetTimeout();
}

darkModeToggle.addEventListener("click", function () {
  html.classList.toggle("dark-mode");
  const themeIcon = document.querySelector("#dark-mode-toggle img");
  const modeIcons = document.querySelector("#mode-toggle");

  if (html.classList.contains("dark-mode")) {
    themeIcon.src = "./darkmode.svg";
    modeIcons.style.filter = "invert(100%)";
  } else {
    themeIcon.src = "./lightmode.svg";
    modeIcons.style.filter = "invert(0%)";
  }
});

fullscreenModeToggle.addEventListener("click", function () {
  const fullscreenIcon = document.querySelector("#fullscreen-mode-toggle img");
  if (!document.fullscreenElement) {
    console.log("full");
    fullscreenIcon.src = "./fullscreenoff.svg";
    document.documentElement.requestFullscreen();
  } else {
    console.log("full off");
    fullscreenIcon.src = "./fullscreen.svg";
    document.exitFullscreen();
  }
});

function twentyFourClock() {
  const currentTime = new Date();
  const hours = currentTime.getHours().toString().padStart(2, "0");
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const seconds = currentTime.getSeconds().toString().padStart(2, "0");
  time = `${hours}:${minutes}:${seconds}`;
  clockElement.innerHTML = time;
  document.title = time;
}

function twelveClock() {
  const currentTime = new Date();
  let hours = currentTime.getHours();
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const seconds = currentTime.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours %= 12;
  hours = hours ? hours : 12;
  hours = hours.toString().padStart(2, "0");

  time = `${hours}:${minutes}:${seconds} ${ampm}`;
  clockElement.innerHTML = time;
  document.title = time;
}

function startClock() {
  const clockTypeSelectedIndex = clockTypeSelector.selectedIndex;
  const clockTypeSelected =
    clockTypeSelector.options[clockTypeSelectedIndex].value;
  clockTypeSelected === "12h" ? twelveClock() : twentyFourClock();
}

setInterval(startClock, 1000);
showElementsOnMouseMove();
