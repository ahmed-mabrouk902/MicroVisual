package org.example.goodyres.Controller;


import org.example.goodyres.Entity.MyNode;
import org.example.goodyres.Service.NodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.sound.midi.Soundbank;
import java.sql.SQLOutput;
import java.util.List;
import java.util.Set;
@CrossOrigin(origins = {"http://frontend:4200", "http://localhost:4200"})
@RestController
@RequestMapping("/api/v1/node")
public class NodeController {

  @Autowired
  NodeService nodeService;


  @GetMapping
  public List<MyNode> getAll() {
    return this.nodeService.getAll();
  }


  @GetMapping("/names")
  public Set<String> getAllNames() {
    return this.nodeService.getName();
  }

  @GetMapping("{name}")
  public MyNode getByName(@PathVariable String name) {
    return this.nodeService.getByName(name);
  }


  @PostMapping
  @PreAuthorize("hasRole('client_admin')")
  public MyNode add(@RequestPart("name") String name,
                    @RequestPart(value = "type") String type
  ) {
    return this.nodeService.add(name, type);
  }

  @DeleteMapping("/{name}")
  @PreAuthorize("hasRole('client_admin')")
  public void delete(@PathVariable String name) {
    this.nodeService.delete(name);
  }

  @DeleteMapping()
  @PreAuthorize("hasRole('client_admin')")
  public void deleteAll() {
    this.nodeService.deleteAll();
  }

  @GetMapping("/one-connection")
  public List<String> getNodeNamesWithOneConnection() {
    System.out.println(nodeService.getNodeNamesWithOneConnection());
    return nodeService.getNodeNamesWithOneConnection();
  }

  @GetMapping("/allConx/{name}")
  public List<String> getAllConx(@PathVariable String name) {
    System.out.println(nodeService.getAllConx(name));
    return nodeService.getAllConx(name);
  }


  @GetMapping("/onlySync")
  public List<String> onlySync() {
    System.out.println(nodeService.onlySync());
    return nodeService.onlySync();
  }
  @GetMapping("/onlyAsync")
  public List<String> onlyAsync() {
    System.out.println(nodeService.onlyAsync());
    return nodeService.onlyAsync();
  }
}
