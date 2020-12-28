/* eslint-disable no-undef */

const calculateTimeoutDelay = microverseTime => {
  const EVENING_MEETING_HOUR = 17;

  // Offset hour means how far is your local timezone away from Microverse timezone.
  // First, how far are you from UTC is calculated,
  // then MICROVERSE_TIMEZONE (+1 for UTC+1, -6 for UTC-6) is added to that offset.
  const offsetHour = Math.floor(Math.abs((new Date().getTimezoneOffset() / 60) + (microverseTime)));

  // Now we prepare the timeoutDelay by calculating the local hour and minutes
  let localHour = EVENING_MEETING_HOUR + offsetHour;
  const localMinutes = Math.floor(Math.abs(new Date().getTimezoneOffset() % 60));

  // If the local hour is more than 24, then the next day starts i.e., 1 AM or 2 AM or 3 AM etc.
  // So we need to reset the localHour to have a proper hour value i.e., not anything more than 24.
  // Then we increment the date by 1.
  let date = new Date();

  if (localHour > 24) {
    localHour -= 24;
    date = new Date(date.setDate(date.getDate() + 1));
  }

  // timeoutDelay is in milliseconds.
  // It's the difference between the time when daily stand-up meeting will start and current time.
  // The difference is calculated in local time.

  let timeoutDelay = new Date(`${date.toDateString()} ${localHour}:${localMinutes}:00`).getTime() - new Date().getTime();

  // This condition below is put for a special edge case.
  // Let's say you are in IST and your Microverse time is -6.
  // The evening meeting meeting will be at 4:30 AM next day.
  // localHour becomes more than 24 so the date shifts to next date.
  // Let's say timeoutDelay starts calculating after 12 AM (eg., 1 AM).
  // The delay would be 3.5 hours. But actually it gives 27.5 hours.
  // A new day has already began after 12 AM.
  // This new day plus the date shift happened before when localHour was found to be more than 24.
  // So 27.5 means 1 day + 3.5 hours.
  // That's this if statement.
  timeoutDelay = timeoutDelay > 86400000 ? timeoutDelay - 86400000 : timeoutDelay;

  return timeoutDelay;
};

const sendNotification = timeoutDelay => {
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
};

chrome.storage.sync.get(['key'], (result) => {
  const timeoutDelay = calculateTimeoutDelay(parseInt(result.key, 10));

  // If timeoutDelay is more than zero i.e., daily stand-up meeting time has not yet passed,
  // then send a chrome notification.
  if (timeoutDelay > 0) {
    sendNotification(timeoutDelay);
  }
});
