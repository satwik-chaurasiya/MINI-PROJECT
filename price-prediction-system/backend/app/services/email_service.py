import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER or "noreply@pricespy.io")

def is_smtp_configured() -> bool:
    return bool(SMTP_HOST and SMTP_USER and SMTP_PASS)

def send_email(to_email: str, subject: str, html_content: str, text_content: str = None) -> bool:
    """
    Sends an email using configured SMTP credentials (e.g., Gmail, SendGrid, Mailgun).
    If SMTP is not configured, logs the dispatch to console and returns False gracefully.
    """
    if not is_smtp_configured():
        print(f"[Email Simulation] To: {to_email} | Subject: {subject}")
        print(f"[Email Content]\n{text_content or html_content}\n")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = SMTP_FROM
        msg["To"] = to_email

        if text_content:
            msg.attach(MIMEText(text_content, "plain"))
        if html_content:
            msg.attach(MIMEText(html_content, "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_FROM, [to_email], msg.as_string())

        print(f"[Email Sent Successfully] To: {to_email} via {SMTP_HOST}")
        return True
    except Exception as e:
        print(f"[Email Send Error] Failed sending to {to_email}: {e}")
        return False

def send_password_reset_email(to_email: str, reset_token: str, app_url: str = "https://pricespy-frontend.onrender.com"):
    reset_link = f"{app_url}/auth?mode=reset&token={reset_token}"
    subject = "🔑 PriceSpy Pro - Password Reset Request"
    text_content = f"""Hello,

You requested a password reset for your PriceSpy Pro account.
Use the following reset token within 15 minutes:

Token: {reset_token}

Or visit: {reset_link}

If you did not request this, you can safely ignore this email.
"""
    html_content = f"""
    <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 24px; border-radius: 12px;">
        <h2 style="color: #10b981;">PriceSpy Pro 🔮 Password Reset</h2>
        <p>You requested a password reset for your account (<strong>{to_email}</strong>).</p>
        <p>Your password reset token (valid for 15 minutes) is:</p>
        <div style="background-color: #1f2937; padding: 12px; font-family: monospace; font-size: 16px; border-radius: 6px; color: #38bdf8;">
            {reset_token}
        </div>
        <p style="margin-top: 20px;">
            <a href="{reset_link}" style="background-color: #10b981; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Reset Password Now
            </a>
        </p>
    </div>
    """
    return send_email(to_email, subject, html_content, text_content)

def send_verification_email(to_email: str, verify_token: str, app_url: str = "https://pricespy-frontend.onrender.com"):
    verify_link = f"{app_url}/dashboard?verify={verify_token}"
    subject = "🛡️ PriceSpy Pro - Verify Your Email Address"
    text_content = f"""Hello,

Welcome to PriceSpy Pro!
Please verify your email address using the token below:

Token: {verify_token}
Or visit: {verify_link}
"""
    html_content = f"""
    <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 24px; border-radius: 12px;">
        <h2 style="color: #10b981;">Welcome to PriceSpy Pro 🔮</h2>
        <p>Please verify your email address to enable instant price drop notifications:</p>
        <div style="background-color: #1f2937; padding: 12px; font-family: monospace; font-size: 16px; border-radius: 6px; color: #38bdf8;">
            {verify_token}
        </div>
        <p style="margin-top: 20px;">
            <a href="{verify_link}" style="background-color: #10b981; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Verify Email Address
            </a>
        </p>
    </div>
    """
    return send_email(to_email, subject, html_content, text_content)

def send_otp_email(to_email: str, otp: str, purpose: str = "Email Verification"):
    subject = f"🔐 Your PriceSpy Pro 6-Digit OTP: {otp} ({purpose})"
    text_content = f"""Hello,

Your 6-digit one-time password (OTP) for {purpose} is:

{otp}

This code expires in 5 minutes. For your security, do not share this code with anyone.
"""
    html_content = f"""
    <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 28px; border-radius: 16px; border: 1px solid #1f2937; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #f43f5e; margin-top: 0;">PriceSpy Pro 🔮</h2>
        <h3 style="color: #ffffff; font-size: 18px; margin-bottom: 8px;">{purpose}</h3>
        <p style="color: #9ca3af; font-size: 13px; line-height: 1.5;">Please use the 6-digit security OTP below to complete verification. This code is strictly valid for 5 minutes.</p>
        <div style="background: linear-gradient(135deg, rgba(163,28,27,0.2), rgba(244,63,94,0.1)); border: 1px solid #A31C1B; padding: 16px 24px; font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; border-radius: 12px; color: #fda4af; margin: 20px 0;">
            {otp}
        </div>
        <p style="color: #6b7280; font-size: 11px; margin-bottom: 0;">If you did not request this OTP, please disregard this email.</p>
    </div>
    """
    return send_email(to_email, subject, html_content, text_content)
