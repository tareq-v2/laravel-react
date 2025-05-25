<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ad Approve Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6;">
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background-color: #f7f7f7;">
        <!-- Header -->
        <tr>
            <td style="padding: 20px; background-color: #2d3748; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">
                    <span style="color: #48bb78;">Armenian</span>Ad
                </h1>
            </td>
        </tr>

        <!-- Content -->
        <tr>
            <td style="padding: 30px 20px;">
                <div style="background-color: #ffffff; padding: 30px; border-radius: 8px;">
                    <h2 style="color: #2d3748; margin-top: 0;">Hi {{$userName}},</h2>
                    <p style="color: #4a5568;">We're excited to let you know that we've received your ad submission and it's currently being processed.</p>
                    
                    <!-- Ad Details -->
                    <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
                        <p style="margin: 5px 0; color: #4a5568;">
                            <strong>Ad Title:</strong> {{ $post->title }}<br>
                        </p>
                    </div>

                    <!-- Status Timeline -->
                    <div style="margin: 25px 0;">
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <div style="width: 24px; height: 24px; background-color: #48bb78; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                                <span style="color: #ffffff; font-size: 14px;">✓</span>
                            </div>
                            <div>
                                <h3 style="margin: 0; color: #2d3748;">Approved</h3>
                                <p style="margin: 5px 0 0 0; color: #718096;">Your ad has Approved.</p>
                            </div>
                        </div>
                        
                    </div>

                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="#" style="background-color: #48bb78; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            View Ads
                        </a>
                    </div>
                </div>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="padding: 20px; text-align: center; color: #718096; font-size: 14px;">
                <p style="margin: 0;">Need help? <a href="mailto:support@adportal.com" style="color: #4299e1; text-decoration: none;">Contact our support team</a></p>
                <p style="margin: 10px 0 0 0;">© {{ date('Y') }} AdPortal. All rights reserved.</p>
                <p style="margin: 5px 0 0 0; color: #a0aec0;">This is an automated message, please do not reply</p>
            </td>
        </tr>
    </table>
</body>
</html>