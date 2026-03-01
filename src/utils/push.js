const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
let expo = new Expo();

/**
 * Send a push notification to a specific device token
 * @param {string} pushToken - The target expo push token
 * @param {string} title - Title of the notification
 * @param {string} body - Body content
 * @param {object} data - Optional data payload
 */
exports.sendNotification = async (pushToken, title, body, data = {}) => {
    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        return;
    }

    // Create the message object
    const message = {
        to: pushToken,
        sound: 'default',
        title: title,
        body: body,
        data: data,
        priority: 'high',
    };

    try {
        const ticketChunk = await expo.sendPushNotificationsAsync([message]);
        console.log('Notification sent successfully:', ticketChunk);
        return ticketChunk;
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

/**
 * Send notifications to multiple tokens
 * @param {Array<string>} tokens - Array of expo push tokens
 * @param {string} title 
 * @param {string} body 
 * @param {object} data 
 */
exports.sendMultipleNotifications = async (tokens, title, body, data = {}) => {
    let messages = [];
    for (let pushToken of tokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
            continue;
        }
        messages.push({
            to: pushToken,
            sound: 'default',
            title,
            body,
            data,
        });
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error(error);
        }
    }
    return tickets;
};
