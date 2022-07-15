let loginWindow = -1;

const backendHost = process.env.VUE_APP_BACKEND_HOST ?? "http://localhost:8000";

const showLogin = ({ focus = true }) => {
  const loginResult = new Promise((resolve) => {
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.windows.getCurrent((tabWindow) => {
      // debugger;
      // const { index } = tabs[0];
      // https://stackoverflow.com/a/5356846/3902950
      const width = Math.round(tabWindow.width * 0.5); // dynamic width
      const height = Math.round(tabWindow.height * 0.75); // dynamic height
      const left = Math.round((tabWindow.width - width) * 0.5 + tabWindow.left);
      const top = Math.round((tabWindow.height - height) * 0.5 + tabWindow.top);

      chrome.windows.create(
        {
          focused: focus,
          width,
          height,
          type: "popup",
          url: `${backendHost}/login`,
          left,
          top,
          // top: 0,
          // left: 0,
        },
        (window) => {
          // window contains the newly opened window
          loginWindow = window.id;
        }
      );
    });
    chrome.windows.onRemoved.addListener((windowid) => {
      // chrome.runtime.sendMessage({ content: `${windowid} was closed! We're waiting for ${loginWindow}` });
      // window was closed, check if it's our window
      if (loginWindow === windowid) {
        // It's our tab! Keep going and try to get the cookies again.
        resolve();
      }
    });
  });
  return loginResult;
};

const getJWt = () =>
  new Promise((cookieResolve) => {
    chrome.cookies.get(
      {
        name: "jwt-auth",
        url: `${backendHost}/auth/jwt`,
      },
      (cookie) => cookieResolve(cookie)
    );
  });

const getUser = async () => {
  // Get JWT
  let cookie = await getJWt();
  if (!cookie?.value) {
    console.log("Cookie not found!");
    await showLogin({ focus: true });
    cookie = await getJWt();
    console.log(cookie);
  } else if (
    !/(^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$)/.test(cookie.value) ||
    JSON.parse(atob(cookie.value.split(".")[1]))?.exp <= Date.now() / 1000
  ) {
    // JWT token is invalid! Either because it's incorrectly formatted or expired
    await showLogin({ focus: false });
    cookie = await getJWt();
  }
  // Try one more time to get the cookie
  if (cookie?.value) {
    // Found the JWT token! We can get details and launch the extention
    const token = cookie.value;
    try {
      const userDataReq = await fetch(`${backendHost}/api/status?supportRefresh=true`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`, // notice the Bearer before your token
        },
      });
      const userData = await userDataReq.json();
      // console.log(userData, token);
      console.log("User data found!");
      console.log(userData);
      if (userData.updated && userData.newJWT) {
        console.log("User data updated! Setting new access tokens");
        return await new Promise((cookieResolve) =>
          chrome.cookies.set(
            {
              httpOnly: cookie.httpOnly,
              name: "jwt-auth",
              url: `${backendHost}/auth/jwt`,
              sameSite: cookie.sameSite,
              secure: cookie.secure,
              storeId: cookie.storeId,
              value: userData.newJWT,
            },
            () => {
              cookieResolve({ token: userData.newJWT, userData });
            }
          )
        );
      }
      return { token, userData };
    } catch (err) {
      console.error(err);
      // Delete cookies and try again
      chrome.cookies.remove(
        {
          name: "jwt-auth",
          url: `${backendHost}/auth/jwt`,
        },
        async () => {
          console.log("Cookie removed!");
        }
      );
    }
  } else {
    console.log("Something went wrong while fetching the cookie.");
  }
  // Failure! No cookie found.
  return {};
};

// Takes message, sender, sendResponse
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  console.log("Message received:", message);
  (async () => {
    switch (message?.content) {
      case "getUser":
        sendResponse(await getUser());
        break;
      case "getCSS":
        // Load CSS file and send url to content script
        sendResponse({ url: chrome.runtime.getURL("css/content-script.css") });
        break;
      case "showPopup":
        // Show popup DOES NOT WORK AS DOCUMENTED!
        // chrome.action.openPopup();
        chrome.windows.create(
          {
            focused: true,
            width: 400,
            // height: 600,
            type: "popup",
            url: "popup.html?permissionless=true",
            top: 0,
            left: 0,
          },
          () => {}
        );
        break;

      default:
        break;
    }
  })();
  return true;
});
