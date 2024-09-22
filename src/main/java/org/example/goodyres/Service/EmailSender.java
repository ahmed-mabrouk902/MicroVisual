package org.example.goodyres.Service;



import org.example.goodyres.Helper.FeedbackDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailSender {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendFeedbackEmail(FeedbackDTO feedbackDTO) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("MicroVisual@gmail.com");
        message.setTo("ahmed.abderrahmen.mabrouk@gmail.com"); // Sending to the same email
        message.setSubject("MicroVisual Feedback:");
        message.setText("Feedback from: " + feedbackDTO.getName() + "\n\n" + feedbackDTO.getMessage());
        mailSender.send(message);
    }
}