// Takes message, sender, sendResponse
chrome.runtime.onMessage.addListener(async (message, _, sendResponse) => {
  console.log("Hello from the background");
  if (message?.content !== "getUser") return;
  console.log(message);

  // Get JWT
  chrome.cookies.get(
    {
      name: "jwt-auth",
      url: "http://localhost:8000/auth/jwt",
    },
    async (cookie) => {
      if (!cookie) {
        console.error("Cookie not found!");
        // No JWT token! We need to get the user to log in
        // TODO: LOGIN IMPLEMENTATION
      }
      // Found the JWT token! We can get details and launch the extention
      const token = cookie.value;
      const userDataReq = await fetch("http://localhost:8000/api/status", {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`, // notice the Bearer before your token
        },
      });
      const userData = await userDataReq.json();
      console.log(userData, token);
      sendResponse({ token, userData });
    }
  );
});
