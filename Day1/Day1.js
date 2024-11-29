function getTime() {
  const now = new Date();

  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();

  const dayArray = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let newHour;
  if (hour === 0) {
    if (minute === 0 && second === 0) {
      newHour = hour + " Midnight";
    } else {
      newHour = hour + " AM";
    }
  } else if (hour < 12) {
    newHour = hour + " AM";
  } else if (hour === 12) {
    if (minute === 0 && second === 0) {
      newHour = hour + " Noon";
    } else {
      newHour = hour + " PM";
    }
  } else {
    newHour = hour - 12 + " PM";
  }

  const timeString1 = `Today is : ${dayArray[day]}.`;
  const timeString2 = `Current time is ${newHour} : ${minute} : ${second}`;
  document.getElementById("clock1").textContent = timeString1;
  document.getElementById("clock2").textContent = timeString2;
}

getTime();
setInterval(getTime, 1000);
