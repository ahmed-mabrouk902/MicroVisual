package org.example.goodyres.Controller;

import jakarta.servlet.http.HttpServletResponse;
import org.example.goodyres.Service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@CrossOrigin(origins = {"http://frontend:4200", "http://localhost:4200"})
@RestController
@RequestMapping("/api/v1/file")
public class FileController {
  @Autowired
  private FileService fileService;
//IMPORT*******************************************************************************************
  @PostMapping("/insert/calls")
  @PreAuthorize("hasRole('client_admin')")
  public ResponseEntity<?> insertExcelFileCalls(@RequestPart("file") MultipartFile file) {
    try {

      this.fileService.insertExcelFileCalls(file.getInputStream());
      return ResponseEntity.ok().body("{\"message\": \"Calls added successfully\"}");
    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\": \"" + e.getMessage() + "\"}");
    } catch (DataAccessException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\": \"" + e.getMessage() + "\"}");
    }


  }

  @PostMapping("/insert/nodes")
  @PreAuthorize("hasRole('client_admin')")
  public ResponseEntity<?> insertExcelFileNodes(@RequestPart("file") MultipartFile file) {
    try {

      this.fileService.insertExcelFileNodes(file.getInputStream());
      return ResponseEntity.ok().body("{\"message\": \"Nodes added successfully\"}");
    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\": \"" + e.getMessage() + "\"}");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"" + e.getMessage() + "\"}");
    }
  }
//
  @GetMapping(value = "/download/call", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
//  @PreAuthorize("hasRole('client_admin')")
  public ResponseEntity<?> exportCallsToExcel(HttpServletResponse response) {
    try {
      String fileName = "calls-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + ".xlsx";
      response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
      response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

      // Get the Excel file as a byte array
      byte[] excelBytes = this.fileService.exportCallsToExcel();

      // Write the byte array to the response output stream
      response.getOutputStream().write(excelBytes);
      response.getOutputStream().flush();

      return ResponseEntity.ok().build();
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e);
    }
  }

  @GetMapping(value = "/download/node", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
//  @PreAuthorize("hasRole('client_admin')")
  public ResponseEntity<?> exportNodesToExcel(HttpServletResponse response) {
    try {
      String fileName = "nodes-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + ".xlsx";
      response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
      response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

      // Get the Excel file as a byte array
      byte[] excelBytes = this.fileService.exportNodesToExcel();

      // Write the byte array to the response output stream
      response.getOutputStream().write(excelBytes);
      response.getOutputStream().flush();

      return ResponseEntity.ok().build();
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e);
    }
  }
}
