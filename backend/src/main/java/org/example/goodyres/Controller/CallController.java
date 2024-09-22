package org.example.goodyres.Controller;


import org.example.goodyres.Entity.Call;
import org.example.goodyres.Service.CallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://frontend:4200", "http://localhost:4200"})
@RestController
@RequestMapping("/api/v1/call")
public class CallController {
  @Autowired
  CallService callService;

  @GetMapping()
  public List<Call> findAllCalls() {
    return this.callService.findAllCalls();
  }


  @PostMapping()
  @PreAuthorize("hasRole('client_admin')")
  public Call addCall(
    @RequestPart("startNode") String startNode,
    @RequestPart("endNode") String endNode,
    @RequestPart("type") String type,
    @RequestPart(value = "topic", required = false) String topic,
    @RequestPart(value = "eventProduced", required = false) String eventProduced,
    @RequestPart(value = "api", required = false) String api,
    @RequestPart(value = "description", required = false) String description) {
    return this.callService.addCall(startNode, endNode, type, topic, eventProduced, api, description);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('client_admin')")
  public Call updateCall(@PathVariable("id") Long id,
                         @RequestPart(value = "type", required = false) String type,
                         @RequestPart(value = "topic", required = false) String topic,
                         @RequestPart(value = "eventProduced", required = false) String eventProduced,
                         @RequestPart(value = "api", required = false) String api,
                         @RequestPart(value = "description", required = false) String description) {
    return this.callService.updateCall(id, type, topic, eventProduced, api, description);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('client_admin')")
  public void deleteCall(@PathVariable Long id) {
    this.callService.deleteCall(id);
  }

  @DeleteMapping()
  @PreAuthorize("hasRole('client_admin')")
  public void deleteAllCalls() {
    this.callService.deleteAllCalls();
  }
}
