import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

class EmailSender:
    def __init__(self):
        self.smtp_host = "smtp.gmail.com"
        self.smtp_port = 587
        self.email_user = os.getenv("EMAIL_USER")
        self.email_pass = os.getenv("EMAIL_PASS")
        self.email_from = os.getenv("EMAIL_FROM", self.email_user)

    def send_role_change_email(self, to_email: str, new_role: str, full_name: str):
        
        """
        Šalje obaveštenje korisniku da mu je promenjena uloga.
        """

        subject = "Promjena uloge na platformi"
        body = (
            f"Poštovani {full_name},<br><br>"
            f"Administrator ti je upravo promijenio ulogu na platformi. "
            f"Nova uloga: <b>{new_role}</b>.<br><br>"
            f"Sada imaš pristup funkcijama koje odgovaraju toj ulozi.<br>"
            f"<br>Srdačan pozdrav,<br>DRS tim"
        )

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = self.email_from
        msg["To"] = to_email

        msg.attach(MIMEText(body, "html"))

        with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
            server.starttls()
            server.login(self.email_user, self.email_pass)
            server.send_message(msg)

    def send_quiz_result_email(self, to_email, quiz_title, score, total, percentage):
        subject= f"Quiz result: {quiz_title}"
        status = "PASSED!" if percentage >= 60 else "FAILED."

        body = (
            f"<h3>Your quiz results {quiz_title}</h3>"
            f"<p>Points: <b>{score} / {total}</b></p>"
            f"<p>Percentage: <b>{percentage}%</b></p>"
            f"<p>Status: <b>{status}</b></p>"
        )

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = self.email_from
        msg["To"] = to_email
        msg.attach(MIMEText(body, "html"))

        try:
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.email_user, self.email_pass)
                server.send_message(msg)
        except Exception as e:
            print(f"Error sending mail: {e}")