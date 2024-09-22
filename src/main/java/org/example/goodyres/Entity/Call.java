package org.example.goodyres.Entity;



import org.springframework.data.neo4j.core.schema.Property;


public class Call {

  @Property("id")
  private Long id;
  @Property("issuer")
  private String issuer;
  @Property("target")
  private String target;
  @Property("type")
  private String type;
  //For Async Calls Only
  @Property("topic")
  private String topic;
  //For Async Calls Only
  @Property("eventProduced")
  private String eventProduced;
  //For Sync Calls Only
  @Property("api")
  private String api;
  @Property("description")
  private String description;

  public Call() {
    // Default constructor
  }

  public Call(Long id, String issuer, String target, String type, String topic, String eventProduced, String api, String description) {
    this.id = id;
    this.issuer = issuer;
    this.target = target;
    this.type = type;
    this.topic = topic;
    this.eventProduced = eventProduced;
    this.api = api;
    this.description = description;
  }

  public Call(String issuer, String target, String type, String topic, String eventProduced, String api, String description) {
    this.issuer = issuer;
    this.target = target;
    this.type = type;
    this.topic = topic;
    this.eventProduced = eventProduced;
    this.api = api;
    this.description = description;
  }

  public String getIssuer() {
    return issuer;
  }

  public void setIssuer(String issuer) {
    this.issuer = issuer;
  }

  public String getTarget() {
    return target;
  }

  public void setTarget(String target) {
    this.target = target;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public String getTopic() {
    return topic;
  }

  public void setTopic(String topic) {
    this.topic = topic;
  }

  public String getEventProduced() {
    return eventProduced;
  }

  public void setEventProduced(String eventProduced) {
    this.eventProduced = eventProduced;
  }

  public String getApi() {
    return api;
  }

  public void setApi(String api) {
    this.api = api;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  @Override
  public String toString() {
    return "Call{" +
      "id=" + id +
      ", issuer='" + issuer + '\'' +
      ", target='" + target + '\'' +
      ", type='" + type + '\'' +
      ", topic='" + topic + '\'' +
      ", eventProduced='" + eventProduced + '\'' +
      ", api='" + api + '\'' +
      ", description='" + description + '\'' +
      '}';
  }
}
