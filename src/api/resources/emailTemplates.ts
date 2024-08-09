export const emailTemplates = {
  resetPassword: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 20px;
      background-color: #007bff;
      color: #fff;
    }
    .content {
      padding: 20px;
    }
    a.button {
      display: inline-block;
      padding: 10px 20px;
      margin: 20px 0;
      font-size: 16px;
      color: #ffffff;
      background-color: #007bff;
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #aaa;
    }
  </style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Password Reset Request</h1>
  </div>
  <div class="content">
    <p>Hello {{name}},</p>
    <p>We received a request to reset your password. Please click the button below to reset your password:</p>
    <a href="{{resetPasswordUrl}}" class="button">Reset Password</a>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Thank you,</p>
    <p>Science hobby center</p>
  </div>
  <div class="footer">
    <p>&copy; 2024 Science hobby center. All rights reserved.</p>
  </div>
</div>
</body>
</html>
`
} as const
