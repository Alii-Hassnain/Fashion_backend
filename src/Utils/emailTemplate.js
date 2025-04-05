
const verification_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              color: #333;
              line-height: 1.8;
          }
          .verification-code {
              display: block;
              margin: 20px 0;
              font-size: 22px;
              color: #4CAF50;
              background: #e8f5e9;
              border: 1px dashed #4CAF50;
              padding: 10px;
              text-align: center;
              border-radius: 5px;
              font-weight: bold;
              letter-spacing: 2px;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Verify Your Email</div>
          <div class="content">
              <p>Hello,</p>
              <p>Thank you for signing up! Please confirm your email address by entering the code below:</p>
              <span class="verification-code">{verificationCode}</span>
              <p>If you did not create an account, no further action is required. If you have any questions, feel free to contact our support team.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;
 const welcome_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Our Community</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #007BFF;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.8;
          }
          .welcome-message {
              font-size: 18px;
              margin: 20px 0;
          }
          .button {
              display: inline-block;
              padding: 12px 25px;
              margin: 20px 0;
              background-color: #007BFF;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              transition: background-color 0.3s;
          }
          .button:hover {
              background-color: #0056b3;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Welcome to Our Community!</div>
          <div class="content">
              <p class="welcome-message">Hello {name},</p>
              <p>We’re thrilled to have you join us! Your registration was successful, and we’re committed to providing you with the best experience possible.</p>
              <p>Here’s how you can get started:</p>
              <ul>
                  <li>Explore our features and customize your experience.</li>
                  <li>Stay informed by checking out our blog for the latest updates and tips.</li>
                  <li>Reach out to our support team if you have any questions or need assistance.</li>
              </ul>
              <a href="#" class="button">Get Started</a>
              <p>If you need any help, don’t hesitate to contact us. We’re here to support you every step of the way.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;

// const orderConfirmationTemplate = `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1">
//   <title>Order Confirmation - FashionVista</title>
//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       background-color: #f4f4f4;
//       margin: 0;
//       padding: 0;
//     }
//     .container {
//       max-width: 600px;
//       margin: 20px auto;
//       background: #ffffff;
//       padding: 20px;
//       border-radius: 10px;
//       box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
//     }
//     .header {
//       text-align: center;
//       padding: 10px;
//       background-color: #4CAF50;
//       color: #ffffff;
//       border-top-left-radius: 10px;
//       border-top-right-radius: 10px;
//     }
//     .content {
//       padding: 20px;
//       text-align: left;
//     }
//     .content p {
//       font-size: 16px;
//       line-height: 1.6;
//       color: #333;
//     }
//     .order-details {
//       background: #f9f9f9;
//       padding: 15px;
//       border-radius: 8px;
//       margin-top: 10px;
//     }
//     .order-details p {
//       margin: 5px 0;
//       font-size: 14px;
//       color: #555;
//     }
//     .btn-container {
//       text-align: center;
//       margin-top: 20px;
//     }
//     .btn {
//       display: inline-block;
//       background-color: #4CAF50;
//       color: white;
//       text-decoration: none;
//       padding: 10px 20px;
//       font-size: 16px;
//       border-radius: 5px;
//       font-weight: bold;
//     }
//     .footer {
//       text-align: center;
//       font-size: 12px;
//       color: #777;
//       padding: 15px 0;
//       border-top: 1px solid #ddd;
//       margin-top: 20px;
//     }
//   </style>
// </head>
// <body>
//   <div class="container">
//     <div class="header">
//       <h2>🎉 Order Placed Successfully!</h2>
//     </div>
//     <div class="content">
//       <p>Hello <strong>{username}</strong>,</p>
//       <p>Thank you for your purchase! Your order has been successfully placed. Here are your order details:</p>
//       <div class="order-details">
//         <p><strong>Order ID:</strong> {orderId}</p>
//         <p><strong>Total Amount:</strong> PKR {totalAmount}</p>
//         <p><strong>Payment Status:</strong> {paymentStatus}</p>
//       </div>
//       <div class="btn-container">
//         <a href="{trackLink}" class="btn">Track My Order</a>
//       </div>
//       <p>We truly appreciate your trust in us and look forward to serving you again. If you have any questions, feel free to contact our support team.</p>
//     </div>
//     <div class="footer">
//       <p>Need help? Contact us at <a href="mailto:support@fashionvista.com">support@fashionvista.com</a> or call +92 300 1234567</p>
//       <p>© 2025 FashionVista. All rights reserved.</p>
//     </div>
//   </div>
// </body>
// </html>
// `;

// const orderConfirmationTemplate = (customerName, orderId, totalPrice, paymentStatus, trackingLink, storeName, supportEmail, phoneNumber) => {
//     return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Order Confirmation</title>
//         <style>
//             body {
//                 font-family: Arial, sans-serif;
//                 background-color: #f4f4f4;
//                 margin: 0;
//                 padding: 0;
//             }
//             .container {
//                 max-width: 600px;
//                 margin: 20px auto;
//                 background: #ffffff;
//                 padding: 20px;
//                 border-radius: 10px;
//                 box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
//             }
//             .header {
//                 text-align: center;
//                 background-color: #007BFF;
//                 padding: 10px;
//                 border-radius: 10px 10px 0 0;
//             }
//             .header h2 {
//                 color: white;
//                 margin: 0;
//             }
//             .content {
//                 padding: 20px;
//             }
//             .content p {
//                 font-size: 16px;
//                 color: #333;
//                 line-height: 1.5;
//             }
//             .order-details {
//                 background: #f9f9f9;
//                 padding: 15px;
//                 border-radius: 8px;
//                 margin-top: 15px;
//             }
//             .order-details p {
//                 margin: 5px 0;
//             }
//             .status {
//                 font-weight: bold;
//                 color: orange;
//             }
//             .payment-status {
//                 font-weight: bold;
//                 color: green;
//             }
//             .button-container {
//                 text-align: center;
//                 margin-top: 20px;
//             }
//             .button {
//                 background: #28a745;
//                 color: white;
//                 padding: 10px 15px;
//                 text-decoration: none;
//                 font-size: 16px;
//                 border-radius: 5px;
//                 display: inline-block;
//             }
//             .footer {
//                 text-align: center;
//                 margin-top: 20px;
//                 font-size: 14px;
//                 color: #666;
//             }
//             .footer a {
//                 color: #007BFF;
//                 text-decoration: none;
//             }
//         </style>
//     </head>
//     <body>
//         <div class="container">
//             <div class="header">
//                 <h2>🎉 Order Placed Successfully!</h2>
//             </div>
//             <div class="content">
//                 <p>Hello <strong>${customerName}</strong>,</p>
//                 <p>Thank you for your purchase! Your order has been successfully placed. Here are your order details:</p>
  
//                 <div class="order-details">
//                     <p><strong>Order ID:</strong> ${orderId}</p>
//                     <p><strong>Status:</strong> <span class="status">Pending</span></p>
//                     <p><strong>Total Amount:</strong> PKR ${totalPrice}</p>
//                     <p><strong>Payment Status:</strong> <span class="payment-status">${paymentStatus}</span></p>
//                 </div>
  
//                 <div class="button-container">
//                     <a href="${trackingLink}" class="button">📦 Track My Order</a>
//                 </div>
  
//                 <p>We truly appreciate your trust in us and look forward to serving you again. If you have any questions, feel free to contact our support team.</p>
  
//                 <p>Best regards,</p>
//                 <p><strong>${storeName}</strong></p>
//             </div>
  
//             <div class="footer">
//                 <p>Need help? Contact us at <a href="mailto:${supportEmail}">${supportEmail}</a> or call ${phoneNumber}</p>
//                 <p>© ${new Date().getFullYear()} ${storeName}. All rights reserved.</p>
//             </div>
//         </div>
//     </body>
//     </html>
//     `;
//   };
  
const orderConfirmationTemplate = (customerName, orderId, totalPrice, paymentStatus, trackingLink, storeName, supportEmail, phoneNumber) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                background-color: #007BFF;
                padding: 10px;
                border-radius: 10px 10px 0 0;
            }
            .header h2 {
                color: white;
                margin: 0;
                font-size: 22px;
            }
            .content {
                padding: 20px;
            }
            .content p {
                font-size: 16px;
                color: #333;
                line-height: 1.5;
                margin: 10px 0;
            }
            .order-details {
                background: #f9f9f9;
                padding: 15px;
                border-radius: 8px;
                margin-top: 15px;
            }
            .order-details p {
                margin: 5px 0;
                font-size: 16px;
            }
            .status {
                font-weight: bold;
                color: orange;
            }
            .payment-status {
                font-weight: bold;
                color: green;
            }
            .button-container {
                text-align: center;
                margin-top: 20px;
            }
            .button {
                background: #28a745;
                color: white;
                padding: 12px 20px;
                text-decoration: none;
                font-size: 18px;
                border-radius: 5px;
                display: inline-block;
                font-weight: bold;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 14px;
                color: #666;
            }
            .footer a {
                color: #007BFF;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>🎉 Order Placed Successfully!</h2>
            </div>
            <div class="content">
                <p style="font-size: 18px;"><strong>Hello ${customerName},</strong></p>
                <p style="font-size: 16px;">Thank you for your purchase! Your order has been successfully placed. Here are your order details:</p>
  
                <div class="order-details">
                    <p><strong>Order ID:</strong> ${orderId}</p>
                    <p><strong>Status:</strong> <span class="status">Pending</span></p>
                    <p><strong>Total Amount:</strong> PKR ${totalPrice}</p>
                    <p><strong>Payment Status:</strong> <span class="payment-status">${paymentStatus}</span></p>
                </div>
  
                <div class="button-container">
                    <a href="${trackingLink}" class="button">📦 Track My Order</a>
                </div>
  
                <p style="font-size: 16px;">We truly appreciate your trust in us and look forward to serving you again. If you have any questions, feel free to contact our support team.</p>
  
                <p style="font-size: 16px;"><strong>Best regards,</strong></p>
                <p style="font-size: 16px;"><strong>${storeName}</strong></p>
            </div>
  
            <div class="footer">
                <p>Need help? Contact us at <a href="mailto:${supportEmail}">${supportEmail}</a> or call ${phoneNumber}</p>
                <p>© ${new Date().getFullYear()} ${storeName}. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  };
  
 
  
  





module.exports = {
    verification_Email_Template,
    welcome_Email_Template,
    orderConfirmationTemplate
}