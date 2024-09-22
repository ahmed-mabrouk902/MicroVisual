package org.example.goodyres.Service;


import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.goodyres.Entity.Call;
import org.example.goodyres.Entity.MyNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class FileService {
  @Autowired
  CallService callService;

  @Autowired
  NodeService nodeService;
///IMPORT******************************************************************************************extract
  /**
   * Insert Calls from an Excel file
   *
   * @param inputStream
   * @throws IOException
   */
  public void insertExcelFileCalls(InputStream inputStream) throws IOException {//inputstream because we will retrieve calls
    //initiate xlsx and array
    Workbook workbook = new XSSFWorkbook(inputStream);
    List<Call> calls = new ArrayList<>();

    Sheet sheet = workbook.getSheetAt(0); // Assuming the data is in the first sheet

    // Iterate through each row of the sheet
    for (int i = sheet.getFirstRowNum() + 1; i <= sheet.getLastRowNum(); i++) {

      Row row = sheet.getRow(i);

      // Read the values from each cell by index
      String issuer = row.getCell(0) != null ? row.getCell(0).getStringCellValue() : null; //colonne 0 fih issuer
      String target = row.getCell(1) != null ? row.getCell(1).getStringCellValue() : null; //colonne 1 fih target
      String type = row.getCell(2) != null ? row.getCell(2).getStringCellValue() : null;//2 fih type
      String topic = row.getCell(3) != null ? row.getCell(3).getStringCellValue() : null;//3 fih topic
      String eventProduced = row.getCell(4) != null ? row.getCell(4).getStringCellValue() : null;//4 fih eventProducer
      String api = row.getCell(5) != null ? row.getCell(5).getStringCellValue() : null;//5 fih api
      String description = row.getCell(6) != null ? row.getCell(6).getStringCellValue() : null;//6 fih description

                                            // Skipping those with either no issuer or no target
                                            if (issuer == null || issuer.isEmpty() || target == null || target.isEmpty()) { //cuz a call require issuer and target
                                              continue;
                                            }

      Call newCall = new Call(issuer, target, type, topic, eventProduced, api, description);// for each i there is creation **instantiating
      calls.add(newCall); //insertion inda list
    }

    this.callService.addAll(calls); //saving all calls into the database
    workbook.close();
    this.callService.deleteDuplicateCalls();
  }

  public void insertExcelFileNodes(InputStream inputStream) throws IOException {

    Workbook workbook = new XSSFWorkbook(inputStream);//init file
    List<MyNode> nodes = new ArrayList<>();//init liste

    Sheet sheet = workbook.getSheetAt(0); // Assuming the data is in the first sheet

    for (int i = sheet.getFirstRowNum() + 1; i <= sheet.getLastRowNum(); i++) {
      Row row = sheet.getRow(i);

      String name = row.getCell(0) != null ? row.getCell(0).getStringCellValue() : null;//colonne 0
      String type = row.getCell(1) != null ? row.getCell(1).getStringCellValue() : null;//colonne 1

                                                // Skip rows with null or empty values for required fields
                                                if (name == null || name.isEmpty()) {
                                                  continue;
                                                }

      // Create a new Node object and save it to the database
      MyNode newNode = new MyNode(name, type);
      nodes.add(newNode);
    }

    List<MyNode> savedNodes = nodeService.addAll(nodes);//saveAll
    workbook.close();

  }
//EXPORT*****************************************************************************************
  public byte[] exportCallsToExcel() throws IOException {

    List<Call> calls = this.callService.findAllCalls();//retrieve all calls


    Workbook workbook = new XSSFWorkbook();
    Sheet sheet = workbook.createSheet("Calls");//initiate


    Row headerRow = sheet.createRow(0);//create th for excel
    headerRow.createCell(0).setCellValue("Initiator/Producer");
    headerRow.createCell(1).setCellValue("Target/Consumer");
    headerRow.createCell(2).setCellValue("Type");
    headerRow.createCell(3).setCellValue("Topic");
    headerRow.createCell(4).setCellValue("Event Produced");
    headerRow.createCell(5).setCellValue("API");
    headerRow.createCell(6).setCellValue("Description");


    int rowNum = 1; // set row at 1
    for (Call call : calls) {//write for each row
      Row row = sheet.createRow(rowNum++);//create row
      row.createCell(0).setCellValue(call.getIssuer());
      row.createCell(1).setCellValue(call.getTarget());
      row.createCell(2).setCellValue(call.getType());
      row.createCell(3).setCellValue(call.getTopic());
      row.createCell(4).setCellValue(call.getEventProduced());
      row.createCell(5).setCellValue(call.getApi());
      row.createCell(6).setCellValue(call.getDescription());
    }

    // Write the workbook to a ByteArrayOutputStream
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    workbook.write(out);
    byte[] data = out.toByteArray();
    workbook.close();

    // Set the content type and headers
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
    headers.setContentDispositionFormData("attachment", "calls.xlsx");
    headers.setContentLength(data.length);

    // Return a ResponseEntity with the Excel file contents
    return data;
  }

  public byte[] exportNodesToExcel() throws IOException {
    // Create a new workbook
    List<MyNode> nodes = this.nodeService.getAll();
    Workbook workbook = new XSSFWorkbook();

    // Create a new sheet
    Sheet sheet = workbook.createSheet("Calls");

    // Create header row
    Row headerRow = sheet.createRow(0);
    headerRow.createCell(0).setCellValue("Name");
    headerRow.createCell(1).setCellValue("Type");


    // Populate the sheet with data from the list of calls
    int rowNum = 1;
    for (MyNode node : nodes) {
      Row row = sheet.createRow(rowNum++);
      row.createCell(0).setCellValue(node.getName());
      row.createCell(1).setCellValue(node.getType());

    }

    // Write the workbook to a ByteArrayOutputStream
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    workbook.write(out);
    byte[] data = out.toByteArray();
    workbook.close();

    // Set the content type and headers
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
    headers.setContentDispositionFormData("attachment", "calls.xlsx");
    headers.setContentLength(data.length);

    // Return the Excel file contents
    return data;
  }
}








