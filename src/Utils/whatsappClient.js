
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const client = new Client({
    authStrategy: new LocalAuth(),  
});


client.on('qr', (qr) => {
    console.log('Please scan the QR code to log in for the first time:');
    // console.log(qr); 

    
    qrcode.toString(qr, { type: 'terminal', small: true }, (err, url) => {
        if (err) console.log('Error generating QR code:', err);
        console.log(url); // Display the QR code in the terminal
    });
   
});

client.on('ready', () => {
    console.log('WhatsApp is ready!');
});


async function sendWhatsAppMessage(phoneNumber, message) {
    const formattedNumber = phoneNumber.replace("+", ""); 
    const number = formattedNumber + '@c.us'; 
    try {
        const chat = await client.getChatById(number);

        await chat.sendMessage(message);
        console.log('Message sent successfully!');
        return true;
    } catch (error) {
        console.error('Error sending whatsApp message:', error);
        return false;
    }
}


client.initialize();

const orderConfirmationMessage = (customerName, orderId, totalPrice, paymentStatus, trackingLink, storeName, supportEmail, phoneNumber) => {
    return `
    🎉 *Order Placed Successfully!*

    Hello *${customerName}*,

    Thank you for your purchase! Your order has been successfully placed. Here are your order details:

    🛒 *Order ID:* ${orderId}
    📦 *Status:* Pending
    💰 *Total Amount:* PKR ${totalPrice}
    💳 *Payment Status:* ${paymentStatus}

    To track your order, click the link below:
    📍 [Track My Order](${trackingLink})

    We truly appreciate your trust in us and look forward to serving you again. If you have any questions, feel free to contact our support team.

    Best regards,
    *${storeName}*

    For assistance, contact us at:
    📧 Email: ${supportEmail}
    📞 Phone: ${phoneNumber}

    © ${new Date().getFullYear()} ${storeName}. All rights reserved.
    `;
};



module.exports = { sendWhatsAppMessage,orderConfirmationMessage };
