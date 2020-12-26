/* eslint-disable no-undef */
const MICROVERSE_TIME = +1; // +1 or -6
const EVENING_MEETING_HOUR = 17;

const offsetHour = Math.floor(Math.abs((new Date().getTimezoneOffset() / 60) + (MICROVERSE_TIME)));

let localHour = EVENING_MEETING_HOUR + offsetHour;
const localMinutes = Math.floor(Math.abs(new Date().getTimezoneOffset() % 60));

let date = new Date();

if (localHour > 24) {
  localHour -= 24;
  date = new Date(date.setDate(date.getDate() + 1));
}

const timeoutDelay = new Date(`${date.toDateString()} ${localHour}:${localMinutes}:00`).getTime() - new Date().getTime();

if (timeoutDelay > 0) {
  setTimeout(() => {
    chrome.runtime.sendMessage('', {
      type: 'notification',
      options: {
        title: "It's time to fill your form!",
        message: "Hey, it's time to complete your daily rituals.",
        iconUrl: '/icon.png',
        type: 'basic',
      },
    });
  }, timeoutDelay);
}
