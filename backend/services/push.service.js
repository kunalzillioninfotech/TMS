const admin = require("../config/firebaseAdmin");

exports.sendPushNotification = async ({ token, title, body }) => {
  try {
    console.log("🔥 Sending push to:", token);

    const res = await admin.messaging().send({
      token,
      notification: { title, body },
    });

    console.log("✅ Push sent:", res);
  } catch (err) {
    console.error("❌ Push error:", err);
  }
};