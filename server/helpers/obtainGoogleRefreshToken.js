const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  "YOUR_CLIENT_ID",
  "YOUR_CLIENT_SECRET",
  "YOUR_REDIRECT_URI" // use the same redirect URI you used in get-auth-url.js
);

(async () => {
  const code = "PASTE_YOUR_CODE_HERE"; // ← replace this

  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("✅ Your tokens:");
    console.log(tokens);
  } catch (err) {
    console.error("❌ Failed to get tokens:", err.response?.data || err.message);
  }
})();
