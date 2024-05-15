import nodemailer from 'nodemailer';
import config from '../app/config';



export const sendEmail = async (to:string,url:string) =>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.NODE_ENV === 'production', 
        auth: {
          user: config.emailSender_email,
          pass: config.emailSender_pass,
        },
      });


      await transporter.sendMail({
        from: '"PH Health Care"<ph.health.care@gmail.com>', 
        to, 
        subject: "Change Your Password", 
        text: "Reset Your Password" ,
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td style="padding: 20px 0 30px 0;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #cccccc;">
                            <tr>
                                <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0;">
                                    <img src="https://example.com/logo.png" alt="Company Logo" width="300" height="230" style="display: block;">
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                                <b>Reset Your Password</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">
                                                We received a request to reset your password. Click the button below to reset your password.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding: 20px 0;">
                                                <a href="${url}" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">
                                                    Reset Password
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px;">
                                                If you did not request a password reset, please ignore this email or contact support if you have questions.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; padding-top: 20px;">
                                                Best regards,<br>
                                                The Company Team
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#ee4c50" style="padding: 30px 30px 30px 30px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;" width="75%">
                                                &reg; Someone, somewhere 2023<br/>
                                                <a href="https://example.com" style="color: #ffffff;"><font color="#ffffff">Unsubscribe</font></a> to this newsletter instantly
                                            </td>
                                            <td align="right" width="25%">
                                                <table border="0" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
                                                            <a href="http://www.twitter.com/" style="color: #ffffff;">
                                                                <img src="https://example.com/twitter.png" alt="Twitter" width="38" height="38" style="display: block;" border="0" />
                                                            </a>
                                                        </td>
                                                        <td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
                                                        <td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
                                                            <a href="http://www.facebook.com/" style="color: #ffffff;">
                                                                <img src="https://example.com/facebook.png" alt="Facebook" width="38" height="38" style="display: block;" border="0" />
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>`, 
      });
      
}