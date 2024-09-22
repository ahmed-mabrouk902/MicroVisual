package org.example.goodyres.Service;



import org.example.goodyres.Entity.Call;
import org.example.goodyres.Helper.CallToMapConverter;
import org.example.goodyres.Repositories.SharedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.dao.DataAccessException;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.data.neo4j.core.Neo4jTemplate;
import org.springframework.data.neo4j.core.mapping.Neo4jMappingContext;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CallService {
  @Autowired
  SharedRepository sharedRepository;
  @Autowired
  private CallToMapConverter callToMapConverter;
  @Autowired
  private Neo4jTemplate neo4jTemplate;
  @Autowired
  private Neo4jClient neo4jClient;

  /**
   * return a list of all avaiable calls
   *
   * @return
   */
  public List<Call> findAllCalls() {
    return sharedRepository.findAllCalls();


  }


  /**
   * add a call relationship
   *
   * @param startNode
   * @param endNode
   * @param type
   * @param topic
   * @param eventProduced
   * @param api
   * @param description
   */
  public Call addCall(String startNode,
                      String endNode,
                      String type,
                      String topic,
                      String eventProduced,
                      String api,
                      String description) {

    if (sharedRepository.findCall(startNode,endNode)!=null){throw new RuntimeException("the call already exists!");}

    return this.sharedRepository.addCall(startNode, endNode, type, topic, eventProduced, api, description);
  }

  public void addAll(List<Call> calls) {

    List<Map<String, Object>> callProperties = calls.stream()
                                                    .map(callToMapConverter::convert)
                                                    .collect(Collectors.toList());//converting calls into List of map

    Set<String> unmatchedNodes = this.sharedRepository
                                      .getUnmatchedNodes(callProperties);//calls with null issuer Or target into a set

                if (!unmatchedNodes.isEmpty()) {throw new DataAccessException("Failed to add calls: " + unmatchedNodes){};
                                                } else {//when all calls attached to nodes
                                                      this.sharedRepository.addCalls(callProperties);
                                                        }

  }

  /**
   * update an existing call
   *
   * @param id
   * @param type
   * @param topic
   * @param eventProduced
   * @param api
   * @param description
   */
  public Call updateCall(Long id,
                         String type,
                         String topic,
                         String eventProduced,
                         String api,
                         String description) {
    return this.sharedRepository.updateCall(id, type, topic, eventProduced, api, description);
  }

  /**
   * Delete A call
   *
   * @param id
   */
  public void deleteCall(Long id) {
    this.sharedRepository.deleteCall(id);
  }

  /**
   * Delete all calls
   */
  public void deleteAllCalls() {
    this.sharedRepository.deleteAllCalls();
  }

  public void deleteDuplicateCalls() {
    List<Call> allCalls = sharedRepository.findAllCalls();
    Map<String, Call> uniqueCalls = new HashMap<>();
    List<Long> idsToDelete = new ArrayList<>();

    for (Call call : allCalls) {
      String pair = call.getIssuer() + "->" + call.getTarget();
      if (uniqueCalls.containsKey(pair)) {
        idsToDelete.add(call.getId());
      } else {
        uniqueCalls.put(pair, call);
      }
    }

    for (Long id : idsToDelete) {
      sharedRepository.deleteCall(id);
    }
  }
}
