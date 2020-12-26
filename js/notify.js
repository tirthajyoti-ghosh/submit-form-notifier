/* eslint-disable no-undef */

// These two 👇 will set by the user.

const MICROVERSE_TIME = +1; // +1 or -6
const EVENING_MEETING_HOUR = 17;

// Offset hour means how far is your timezone away from Microverse timezone.
// First, how far are you from UTC is calculated,
// then MICROVERSE_TIMEZONE (+1 for UTC+1, -6 for UTC-6) is added to that offest.

const offsetHour = Math.floor(Math.abs((new Date().getTimezoneOffset() / 60) + (MICROVERSE_TIME)));

// Now we prepare the timeoutDelay by calculating the local hour and minutes

let localHour = EVENING_MEETING_HOUR + offsetHour;
const localMinutes = Math.floor(Math.abs(new Date().getTimezoneOffset() % 60));

// If the local hour is more than 24, then the next day starts i.e., it will be 1 AM or 2 AM, etc.
// So we need to reset the localHour so that it has proper hour value, not anything more than 24.
// Then we increment the date by 1.

let date = new Date();

if (localHour > 24) {
  localHour -= 24;
  date = new Date(date.setDate(date.getDate() + 1));
}

// timeoutDelay is value in milliseconds.
// It is difference between the time when daily stand-up meeting will start and the current time.
// The difference is calculated in local time.

const timeoutDelay = new Date(`${date.toDateString()} ${localHour}:${localMinutes}:00`).getTime() - new Date().getTime();

// If timeoutDelay is more than zero i.e., daily stand-up meeting time has not yet passed,
// then send a chrome notification.

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
