package org.example.goodyres.Service;


import org.example.goodyres.Entity.Call;
import org.example.goodyres.Entity.MyNode;
import org.example.goodyres.Repositories.SharedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class NodeService {
  @Autowired
  SharedRepository sharedRepository;


  /**
   * Add a microservice to database
   *
   * @param
   * @param name
   */
  public MyNode add(String name, String type) {
    if (!sharedRepository.existsById(name)) {
      MyNode newNode = new MyNode(name, type);
      return this.sharedRepository.save(newNode);
                                            }else{ throw  new RuntimeException("the name already exist!");}
//    return null;
  }

  public List<MyNode> addAll(List<MyNode> nodes) {
    return this.sharedRepository.saveAll(nodes);
  }

  /**
   * Get one microservice by name
   *
   * @param name
   * @return
   */
  public MyNode getByName(String name) {
    return this.sharedRepository.findById(name).orElse(null);
  }

  public Set<String> getName() {
    return sharedRepository.getAllNames();
  }

  /**
   * Get all microservices in database
   *
   * @return
   */
  public List<MyNode> getAll() {
    return this.sharedRepository.findAll();
  }

  /**
   * delete a microservice
   *
   * @param name
   */
  public void delete(String name) {

    this.sharedRepository.deleteById(name);

  }

  /**
   * Delete all nodes
   */
  public void deleteAll() {
    this.sharedRepository.deleteAll();
  }


  public void deleteDuplicateNodes() {
    List<MyNode> nodes = sharedRepository.findAll();
    Map<String, MyNode> uniqueNode = new HashMap<>();
    List<String> idsToDelete = new ArrayList<>();

    for (MyNode node : nodes) {
      String pair = node.getName();
      if (uniqueNode.containsKey(pair)) {
        idsToDelete.add(node.getName());
      }

    }


      sharedRepository.deleteAllById(idsToDelete);

  }

  public List<String> getNodeNamesWithOneConnection() {
    return sharedRepository.findNodeNamesWithOneConnection();
  }
  public List<String> getAllConx(String name) {
    return sharedRepository.findAllNodeRelations(name);
  }

  //call related nodes only based on type of call
  public List<String> onlySync() {
    return sharedRepository.findAllSync();
  }
  public List<String> onlyAsync() {
    return sharedRepository.findAllAsync();
  }
}
