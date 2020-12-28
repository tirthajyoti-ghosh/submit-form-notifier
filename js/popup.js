/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', () => {
  const formElement = document.getElementById('form');

  formElement.onsubmit = e => {
    e.preventDefault();

    const option = document.getElementById('microverse-time');
    chrome.storage.sync.set({ key: option.value }, () => {
      console.log(`Value is set to ${option.value}`);
    });
  };
});
