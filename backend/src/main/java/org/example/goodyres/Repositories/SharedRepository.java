package org.example.goodyres.Repositories;



import org.example.goodyres.Entity.Call;
import org.example.goodyres.Entity.MyNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;
import java.util.Set;
@EnableNeo4jRepositories(considerNestedRepositories = true)
public interface SharedRepository extends Neo4jRepository<MyNode, String> {
  //RETRIEVING************************************************************************************************************
  @Query("MATCH (n) RETURN n.name as name")
  public Set<String> getAllNames();

  @Query("MATCH (i:MyNode)-[r]->(t:MyNode) RETURN r.id AS id , i.name AS issuer , t.name AS target,  r.type AS type , r.topic AS topic , r.eventProduced AS eventProduced , r.api AS api , r.description AS description")
  public List<Call> findAllCalls();
  @Query("MATCH (i:MyNode)-[r]->(t:MyNode)\n" +
          "WHERE i.name = $startNode AND t.name = $endNode\n" +
          "RETURN r.id AS id, i.name AS issuer, t.name AS target, r.type AS type, r.topic AS topic, r.eventProduced AS eventProduced, r.api AS api, r.description AS description")
  public Call findCall(String startNode,String endNode); //searching if call exist for redundance
  @Query(
          "UNWIND $calls AS call " +                                      //Unwind take individual call from calls inserted(specified index, property)
                  "OPTIONAL MATCH (a:MyNode {name: call.startNode}) " +
                  "OPTIONAL MATCH (b:MyNode {name: call.endNode}) " +     // look for StartNode and EndNode from MyNodeEntity

                  "WITH call, a, b " +                                    // chaining all together WITH call,a,b
                  "WHERE a IS NULL OR b IS NULL " +                       //if issuer or target = null
                  "RETURN call.startNode + ' -> ' + call.endNode AS unmatchedNodes" // retrieve when call having issuer null or target null
  )
  Set<String> getUnmatchedNodes(@Param("calls") List<Map<String, Object>> calls);

//CREATING*********************************************************************************************************************
  @Query(" MATCH (a:MyNode), (b:MyNode)\n" +
          "WHERE a.name = $startNode AND b.name = $endNode\n" +
          "CREATE (a)-[r:CALLS ]->(b)\n" +
          "SET r.id = ID(r) , r.type = $type, r.topic = $topic , r.eventProduced = $eventProduced , r.api = $api , r.description = $description\n" +
          "RETURN r")
  public Call addCall(String startNode, String endNode, String type, String topic, String eventProduced, String api, String description);

  @Query("UNWIND $calls AS call " +

          "MERGE (a:MyNode { name: call.startNode }) " +
          "MERGE (b:MyNode { name: call.endNode }) " + //pour les noeud ken fama retrieve sinon creation

          "WITH call, a, b " +
          "OPTIONAL MATCH (a)-[r:CALLS]->(b) WHERE r.type = call.type " + // search for the call

          "FOREACH (ignore IN CASE WHEN r IS NULL THEN [1] ELSE [] END | " +//if not found create a new one
          "  CREATE (a)-[newR:CALLS]->(b) " +
          "  SET newR.id = ID(newR), newR.type = call.type, newR.topic = call.topic, " +
          "  newR.eventProduced = call.eventProduced, newR.api = call.api, " +
          "  newR.description = call.description " +
          ") " +

          "FOREACH (ignore IN CASE WHEN r IS NOT NULL THEN [1] ELSE [] END | " + //ignore if found and update with call properties
          "  SET r.id = ID(r), r.topic = call.topic, r.eventProduced = call.eventProduced, " +
          "  r.api = call.api, r.description = call.description " +
          ")")
  void addCalls(@Param("calls") List<Map<String, Object>> calls); //for import
//UPDATING****************************************************************************************
  @Query("MATCH ()-[r]->()\n" +
          "WHERE r.id = $id\n" +
          "SET  r.type = $type, r.topic = $topic , r.eventProduced = $eventProduced , r.api = $api , r.description = $description\n" +
          "RETURN r")
  public Call updateCall(Long id, String type, String topic, String eventProduced, String api, String description);
//DELETING********************************************************************************
  @Query("MATCH ()-[r]->()\n" +
          "WHERE r.id = $id\n" +
          "DELETE r")
  public void deleteCall(Long id);

  @Query("MATCH ()-[r]->()\n" +
          "DELETE r")
  public void deleteAllCalls();




//nodes warning disconnection
                                                                                                                                        // Check if removing the target would disconnect a from b by ensuring there are no other paths connecting a and b
//MATCH (a:MyNode)-[r1]-(target)-[r2]-(b:MyNode) WHERE id(a) < id(b) AND NOT (a)-[:RELATIONSHIP_TYPE]-(b) AND NOT EXISTS { MATCH (a)-[altR]-(altTarget)-[altR2]-(b) WHERE altTarget <> target } RETURN DISTINCT target.name AS nodeName
  @Query("MATCH (a:MyNode)-[r1]-(target)-[r2]-(b:MyNode)\n" +
          "WHERE id(a) < id(b) \n" +
          "AND NOT (a)-[:RELATIONSHIP_TYPE]-(b) \n" +
          "AND NOT EXISTS { \n" +
          "  MATCH (a)-[altR]-(altTarget)-[altR2]-(b) \n" +
          "  WHERE altTarget <> target \n" +
          "}\n" +
          "RETURN DISTINCT target.name AS nodeName\n")
List<String> findNodeNamesWithOneConnection();

//for a better shortcut
  @Query("MATCH (n:MyNode {name: $name })-[:CALLS*]->(m) RETURN DISTINCT m.name")
  List<String> findAllNodeRelations(String name);
//onlysync
  @Query("MATCH p=(n:MyNode)-[r]->(m) WHERE r.type = 'sync' RETURN DISTINCT n.name")
  List<String> findAllSync();
  //onlyasync
  @Query("MATCH p=(n:MyNode)-[r]->(m) WHERE r.type = 'async' RETURN DISTINCT n.name")
  List<String> findAllAsync();


}
