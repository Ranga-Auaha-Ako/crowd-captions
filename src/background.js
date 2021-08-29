// Takes request, sender, sendResponse
browser.runtime.onMessage.addListener(() => {
  console.log('Hello from the background');

  browser.tabs.executeScript({
    file: 'content-script.js',
  });
});
