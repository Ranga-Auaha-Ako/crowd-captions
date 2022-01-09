import localforage from 'localforage'

const launchWebAuthFlow = async (url) => new Promise((resolve) => {
    chrome.identity.launchWebAuthFlow({
      interactive: true,
      url
    }, (responseUrl) => {
      resolve(responseUrl)
    });
  });


// Takes request, sender, sendResponse
chrome.runtime.onMessage.addListener(async (request, _, sendResponse) => {
  console.log('Hello from the background');
  console.log(request);
  let token;
  const tokenData = await localforage.getItem("crowdcaptions-panopto-token");
  if(tokenData && tokenData.accessToken && tokenData.tokenType === "Bearer" && tokenData.expiresIn > Date.now()) {
    // We already have a valid token
    console.log(`Found valid token already! Expires in ${(tokenData.expiresIn-Date.now())/60} minutes`)
    token=tokenData.accessToken
  } else {
    // We need to trigger a sign-in
    // D6tzleY9ZMtcuBsiTFHTa2dcbwBdrXCPARso7IrPu8o=
    // 6a0aa27c-8eeb-4aae-b134-adf2002ad875
    const clientID = "705188f6-2388-4326-a21a-adf6000aeb57";
    const formData = new URLSearchParams({
      'client_id': clientID,
      'scope': 'API OpenID',
      'redirect_uri': 'https://cfkigfjjdakjlpenafephohfpoknfkjm.chromiumapp.org/provider_cb',
      'response_type': 'token',
      'nonce': Date.now()
    })
    const url = `https://aucklandtest.au.panopto.com/Panopto/oauth2/connect/authorize?${formData.toString()}`
    const redirectUrl = await launchWebAuthFlow(url);
    const [,tokenURL] = redirectUrl.split("#")
    token = Object.fromEntries(tokenURL.split("&").map(i => i.split("=")))
    console.log(token)
    // Find user info
    const base64Token = Buffer.from(token.accessToken, 'utf8').toString('base64');
    const userInfoReq = await fetch("https://aucklandtest.au.panopto.com/Panopto/oauth2/connect/userinfo",{
      headers: new Headers({
        'Authorization': `Basic ${base64Token}`, 
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    })
    const userInfo = await userInfoReq.json()
    console.log(userInfo)
    sendResponse({token, userInfoReq, userInfo})
      //  sendResponse({farewell: "test"})
  }
  console.log(token)
});
