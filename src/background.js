let loginTab = -1;

const backendHost = process.env.VUE_APP_BACKEND_HOST ?? "http://localhost:8000";

const showLogin = ({ focus = true }) => {
  const loginResult = new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // debugger;
      const { index } = tabs[0];
      chrome.tabs.create(
        {
          url: `${backendHost}/login`,
          index: index + 1,
          active: focus,
        },
        (tab) => {
          // Tab contains the newly opened tab
          loginTab = tab.id;
        }
      );
    });
    chrome.tabs.onRemoved.addListener((tabid) => {
      // chrome.runtime.sendMessage({ content: `${tabid} was closed! We're waiting for ${loginTab}` });
      // Tab was closed, check if it's our tab
      if (loginTab === tabid) {
        // It's our tab! Keep going and try to get the cookies again.
        resolve();
      }
    });
  });
  return loginResult;
};

let attempts = 0;

const getUser = () => {
  const user = new Promise((resolve) => {
    // Get JWT
    chrome.cookies.get(
      {
        name: "jwt-auth",
        url: `${backendHost}/auth/jwt`,
      },
      async (cookie) => {
        if (!cookie?.value) {
          console.log("Cookie not found!");
          // No JWT token! We need to get the user to log in. Focus on the tab so that they can action if needed!
          attempts += 1;
          if (attempts <= 3) {
            await showLogin({ focus: true });
            resolve(await getUser());
          }
        } else if (
          !/(^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$)/.test(cookie.value) ||
          JSON.parse(atob(cookie.value.split(".")[1]))?.exp <= Date.now() / 1000
        ) {
          // JWT token is invalid! Either because it's incorrectly formatted or expired
          await showLogin({ focus: false });
          resolve(await getUser());
        } else {
          // Found the JWT token! We can get details and launch the extention
          const token = cookie.value;
          const userDataReq = await fetch(`${backendHost}/api/status`, {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`, // notice the Bearer before your token
            },
          });
          const userData = await userDataReq.json();
          // console.log(userData, token);
          resolve({ token, userData });
        }
      }
    );
  });
  return user;
};

// Takes message, sender, sendResponse
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  (async () => {
    // console.log(message);
    if (message?.content === "getUser") {
      const response = await getUser();
      sendResponse(response);
    }
  })();
  return true;
});
