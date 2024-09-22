package org.example.goodyres.Controller;

import jakarta.mail.MessagingException;
import org.example.goodyres.Entity.MyNode;
import org.example.goodyres.Helper.FeedbackDTO;
import org.example.goodyres.Service.EmailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = {"http://frontend:4200", "http://localhost:4200"})
@RestController
@RequestMapping("/api/v1/email")
public class EmailController {

    @Autowired
    private EmailSender emailService;

    @PostMapping("/send")
    public ResponseEntity<String> sendFeedback(@RequestBody FeedbackDTO feedbackDTO) {
        try {
            emailService.sendFeedbackEmail(feedbackDTO);
            return ResponseEntity.ok("Feedback sent successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to send feedback: " + e.getMessage());
        }
    }
}
