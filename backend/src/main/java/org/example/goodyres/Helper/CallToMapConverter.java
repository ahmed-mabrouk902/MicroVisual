package org.example.goodyres.Helper;


import org.example.goodyres.Entity.Call;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class CallToMapConverter implements Converter<Call, Map<String, Object>> {

  @Override
  public Map<String, Object> convert(Call call) {

    Map<String, Object> properties = new HashMap<>();

    properties.put("startNode", call.getIssuer());             //(mark as startNode index , value of issuer)
    properties.put("endNode", call.getTarget());              //endNode index, value target
    properties.put("type", call.getType());                   //type index, type
    properties.put("topic", call.getTopic());                 //topic index ,topic
    properties.put("eventProduced", call.getEventProduced()); //eventProducer index, eventProducer
    properties.put("api", call.getApi());                     // api index, api
    properties.put("description", call.getDescription());     //description index, description

    return properties; //properties(index "property" , property)
  }
}
