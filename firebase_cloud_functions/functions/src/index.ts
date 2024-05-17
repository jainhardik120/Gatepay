/* eslint-disable object-curly-spacing */

import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

initializeApp();

export const sendNotification = onRequest(async (request, response) => {
  const { deviceToken, message, title, data } = request.body;
  if (!deviceToken || !message || !title) {
    response.status(400).json(
      { error: "Missing deviceToken or message or title" },
    );
    return;
  }
  let payload: any = {
    token: deviceToken,
    notification: {
      title: title,
      body: message,
    },
  };
  if (data !== undefined) {
    payload = { ...payload, data: data };
  }
  try {
    const messageId = await getMessaging().send(payload);
    response.status(200).json({
      success: "Notification sent successfully",
      messageId: messageId,
    });
  } catch (error) {
    console.error(
      "Error sending notification:",
      (error as { errorInfo: { message: string } }).errorInfo.message
    );
    response.status(500).json(error);
  }
});
