/* eslint-disable no-undef */
const MICROVERSE_TIME = -6; // +1 or -6
const EVENING_MEETING_HOUR = 17;

const offsetHour = Math.floor(Math.abs((new Date().getTimezoneOffset() / 60) + (MICROVERSE_TIME)));

let localHour = EVENING_MEETING_HOUR + offsetHour;
if (localHour > 24) localHour -= 24;

const localMinutes = Math.floor(Math.abs(new Date().getTimezoneOffset() % 60));

const timeoutDelay = new Date(`${new Date().toDateString()} ${localHour}:${localMinutes}:00`).getTime() - new Date().getTime();
// const timeoutDelay = new Date(new Date().toDateString() + ` 00:43:00`).getTime() - new Date().getTime();

// console.log("Notification coming in", (new Date(new Date().toDateString() + ` ${localHour}:${localMinutes}:00`).getTime() - new Date().getTime()) / 1000 / 60 / 60);

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
