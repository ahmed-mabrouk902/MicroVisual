import { Component, ElementRef, OnInit, ViewChild, OnDestroy, HostListener, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Call } from 'app/call';
import { CallsService } from 'app/calls.service';
import { Node } from 'app/node';
import { NodeService } from 'app/node.service';
import { KeycloakService } from 'keycloak-angular';
import NeoVis, { NeoVisEvents, NeovisConfig } from 'neovis.js';
import { stringify } from 'querystring';
import { map, startWith } from 'rxjs';
import Swal from 'sweetalert2';
import { allOptions } from 'vis-network/declarations/network/options';
// import { databaseSwitch } from '../navbar/databaseSwitch.service';

@Component({
  moduleId: module.id,
  selector: 'app-graph-visualization',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, OnDestroy {
  

  nodeOptions: string[] = [];
  nodeTypes: string[] = [];
  callTypes: string[] = [];

selectNody: string[] | undefined;

  
  constructor(private nodeService: NodeService, private callsService: CallsService, private renderer: Renderer2, private keycloakService: KeycloakService) {
//to show under the input when searching
    this.searchControl = new FormControl('');
    this.searchForm = new FormGroup({
      searchControl: this.searchControl
    });
  }
  
  
  
  tooltipVisible: boolean = false;
  tooltipTitle: string = '';
  tooltipDetails: string = '';
  tooltipPosition: { top: string, left: string } = { top: '0px', left: '0px' };


  private initNeoVis(): void {
    try {
      const config: NeovisConfig = {
        containerId: this.graphContainer.nativeElement.id,
        neo4j: {
          serverUrl: "bolt://localhost:7687",
          serverUser: "neo4j",
          serverPassword: "12345678"
        },
        visConfig: {
      //forms
          nodes: {
            shape: 'dot',
            size: 25,
            font: {
              size: 14,
              color: '#000'
            },
            borderWidth: 2
          },
          edges: {
            width: 2,
            color: '#848484',
            arrows: {
              to: { enabled: true, scaleFactor: 1.2 }
            },
            smooth:false,
            font: {
              size: 12,
              align: 'middle'
            }
          }
                
          ,
          physics: {
            enabled: true,
            
            barnesHut: {
              gravitationalConstant: -2000,
              centralGravity: 0.3,
              springLength: 95,
              springConstant: 0.04,
              damping: 0.09
            },
            stabilization: {
              enabled: true,
              iterations: 1000,
              updateInterval: 25
            }
          }
          ,
          layout: {
            improvedLayout: true              // Ensures a more visually appealing layout without curving edges
          }
          
        },
        labels: {
          MyNode: {
            label: "name",
            group: "community",
            //functional
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
              function: { 
                title: (node) => { 
                  //for hover infotip
                  const isInList = this.nodeNamesWOneCon.includes(node.properties.name);
                  if(isInList){
                    return `Name: ${node.properties.name}
                          Type: ${node.properties.type}
                          (!!!!)`;
                  }else                                                      
                  {
                    return `Name: ${node.properties.name}
                          Type: ${node.properties.type}`;
                        }
                },
                
                color: (node) => {
                  //for color control
                  return this.nodeColorMap[`${node.properties.type}`] || '#dcf62f';
                  
                
              }
            }
            }
          }
        },
        relationships: {
          CALLS: {
            label: "type",
            color: "#b8adad",
            //functional
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
              function: {
                title: (edge) => {
                  //for hover
                  if(`${edge.properties.type}`==='sync'){
                  return `ID: ${edge.properties.id}
                          Type: ${edge.properties.type}

                          API: ${edge.properties.api}
                          Description: ${edge.properties.description}`;
                }else{
                  return `ID: ${edge.properties.id}
                          Type: ${edge.properties.type}

                          Event Produced: ${edge.properties.eventProduced}
                          Topic: ${edge.properties.topic}
                          Description: ${edge.properties.description}`;
                }
                  
                },
                color: (edge) => {
                  if(`${edge.properties.type}`==='sync'){
                    return "#6b6969";
                  }
                  else{return "#c9c5c4";}
                }
              },
              
            }
            
          }
        },
        initialCypher: "MATCH (n:MyNode)-[r:CALLS]->(m:MyNode) RETURN n,r,m"
      };

      this.neoVis = new NeoVis(config);
      this.neoVis.render();
      this.centerGraph();
      
       // Delay to allow the graph to update before checking if it's empty
    setTimeout(() => {
      const nodeCount = this.neoVis.nodes.length;

      if (nodeCount === 0) {
        Swal.fire({
          icon: 'error',
          title: 'No Data',
          text: 'DATABASE IS EMPTY!!!!',
        });
      } else {
        this.centerGraph(); // Center the graph if it's not empty
      }
    }, 1000); // Adjust the delay time if needed

//INFOTIP
      this.neoVis.registerOnEvent(NeoVisEvents.CompletionEvent, () => {
        const network = this.neoVis?.network;

        if (network) {
          network.on('hoverNode', (params) => {
            const node = this.neoVis?.nodes[params.node];
            if (node) {
              this.showTooltipForNode(node, params.event);

            }
          });

          network.on('hoverEdge', (params) => {
            const edge = this.neoVis?.edges[params.edge];
            if (edge) {
              this.showTooltipForEdge(edge, params.event);
            }
          });

          network.on('blurNode', () => {
            this.hideTooltip();
          });

          network.on('blurEdge', () => {
            this.hideTooltip();
          });

          // Add the double-click event listener for node deletion
          network.on('doubleClick', (params) => {
            const node = params.nodes[0]; // Ensure nodes is an array
            
           const nodedata =this.neoVis?.nodes.get(node);
           
           
           
           const nodeName = nodedata['label']

            if (nodeName && this.isAdmin) {
              if (nodeName) {
                Swal.fire({
                  title: 'Are you sure to delete this?',
                  text: `${nodeName}`,
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, delete it!',
                  cancelButtonText: 'No, cancel',
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.deleteNode1(nodeName); // Pass the node name to deleteNode1
                    this.retrieveNodes();
                    Swal.fire('Deleted!', `Node "${nodeName}" has been deleted.`, 'success');
                  }
                });
              }
            } else {
              console.log('No node ID found in click params');
            }
          });

          // network.on('selectNode', (params) => {
          //   const edge = params.edges;
          //  const edgedata =this.neoVis?.edges.get(edge);
          //   console.log(edgedata);
          //   if (edge) {
              
          //   }
          // });
 
  this.isplay = true;
  network.setOptions({ physics: this.isplay
   });
   
  

           
      }

        
      });

    } catch (error) {
      console.error('Error initializing NeoVis:', error);
    }
  }
  //delete node
  deleteNode1(node: any) {
    this.retrieveNodes();
    this.nodeService.deleteNode(node).subscribe({
      next: () => {
        console.log(`Node "${node}" deleted successfully`);
        this.disconnection();
        this.refreshVisualization();
        
      },
      error: (error) => console.error('Error deleting node:', error)
    });
  }

//fullscreen 
toggleFullScreen(): void {
  const elem = this.graphContainer.nativeElement;
  
  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
      elem.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

  //INFOTIP

  private showTooltipForNode(node: any, event: MouseEvent): void {
    this.tooltipTitle = `Node: ${node.name}`;
    this.tooltipDetails = `ID: ${node.id}\nProperties: ${JSON.stringify(node.properties)}`;
    this.tooltipPosition = {
      top: `${event.clientY + 10}px`,
      left: `${event.clientX + 10}px`
    };
    this.tooltipVisible = true;
  }

  private showTooltipForEdge(edge: any, event: MouseEvent): void {
    this.tooltipTitle = `Edge: ${edge.label}`;
    this.tooltipDetails = `ID: ${edge.id}\nProperties: ${JSON.stringify(edge.properties)}`;
    this.tooltipPosition = {
      top: `${event.clientY + 10}px`,
      left: `${event.clientX + 10}px`
    };
    this.tooltipVisible = true;
  }

  private hideTooltip(): void {
    this.tooltipVisible = false;
  }







//COLORPICKER

        selectedNodeType: string = '';
        selectedColor: string = '';
        nodeColorMap: { [key: string]: string } = {};
        
        private initColorMap() {
          const defaultColors = ['#ADD8E6'/*, '#7786f9', '#dcf62f', '#f9a857', '#f957b3', '#57d2f9'*/];
          this.nodeTypes.forEach((type, index) => {
            this.nodeColorMap[type] = this.nodeColorMap[type] || defaultColors[index % defaultColors.length];
          });
        }
        retrieveNodeTypes() {
          this.nodeService.getAllNodes().subscribe((res: Node[]) => {
            this.nodeTypes = Array.from(new Set(res.map(node => node.type)));
            this.initColorMap();
          },
            error => console.error('Error fetching node types:', error)
          );
        }
                  colorUse:boolean=false;
                  updateNodeColor() {if(!this.colorUse){
                    
                    for (const type of this.nodeTypes) {
                      this.nodeColorMap[type]= '#D3D3D3';
                    }
                    this.nodeColorMap[this.selectedNodeType] = '#32CD32';
                    this.reload();
                  }
                    else if (this.colorUse) {
                      this.nodeColorMap[this.selectedNodeType] = this.selectedColor;

                      this.reload();
                    }
                  }

//refreshing**********************************
refreshVisualization() {
  if (this.neoVis) {
    if(this.showMatched==true){
        this.showMatchedNodes();
    }else if (this.showUnmatched==true){
      this.showUnmatchedNodes();
    }
    else{ this.neoVis.reload();}
  }
}
reload(){
  if (this.neoVis) {

    this.neoVis.reload();
  }

}
//refreshing***************************









//for one connection
isStringInList(targetString: string, stringList: string[] | null): boolean {
  if (!Array.isArray(stringList)) {
    // If stringList is null or not an array
    console.error('stringList is not a valid array');
    return false;
  }
  return stringList.indexOf(targetString) !== -1;
}
//for nodes that cause disconnection
nodeNamesWOneCon:string[];


//for authority
isAdmin:boolean;
  ngOnInit(): void {
    this.initNeoVis();

    // this.retrieveAllRelations();

    this.retrieveNodes();
    this.retrieveNodeTypes();



    this.retrieveApi();
    this.retrieveTopic();
    this.retrieveEventProducer()

    //for authority in deleting
    const userRoles: string[] = this.keycloakService.getUserRoles();
                        this.isAdmin = userRoles.includes('admin');
//for disconnection alert
    this.disconnection();
//for menu under input
this.searchControl.valueChanges.pipe(
  startWith(''),
  map(value => this._filter(value))
).subscribe(filtered => this.filteredNodes = filtered);
    // switch
      // this.loadDatabases();


     
  }
disconnection(){
  this.nodeService.getNodeNamesWithOneConnection().subscribe(
      data => {
        this.nodeNamesWOneCon = data;
        console.log(data);
      },
      error => {
        console.error('Error fetching node names', error);
      }
    );
}


  @ViewChild('graphContainer', { static: true }) graphContainer!: ElementRef;
  private neoVis: NeoVis | null = null;
  ngOnDestroy(): void {
    if (this.neoVis) {
      this.neoVis.clearNetwork();
      this.neoVis = null;
    }
  }

  
msg:any;
  

  centerGraph(): void {
    if (this.neoVis && this.neoVis.network) {
      this.neoVis.network.fit();
    }
  }

  changeCypherQuery(query: string): void {
    if (this.neoVis) {
      this.neoVis.clearNetwork();
      this.neoVis.updateWithCypher(query);
      this.centerGraph();
      
                                                      // Delay to allow the graph to update before checking if it's empty
                                                    setTimeout(() => {
                                                      const nodeCount = this.neoVis.nodes.length;

                                                      if (nodeCount === 0) {
                                                        Swal.fire({
                                                          icon: 'error',
                                                          title: 'No Data',
                                                          text: 'The query returned an empty graph. Please try a different query.',
                                                        });
                                                      } else {
                                                        this.centerGraph(); // Center the graph if it's not empty
                                                      }
                                                    }, 1000); // Adjust the delay time if needed
                                                    }
  }
showMatched:boolean=false;
  showMatchedNodes(): void {
    this.showMatched=true;
    this.showUnmatched=false;
    this.changeCypherQuery('MATCH (n:MyNode)-[r:CALLS]->(m:MyNode) RETURN n,r,m');
  }
showUnmatched:boolean=false;
  showUnmatchedNodes(): void {
    this.showUnmatched=true;
    this.showMatched=false
    this.changeCypherQuery('MATCH (n:MyNode) WHERE NOT (n)-[:CALLS]->() AND NOT ()-[:CALLS]->(n) RETURN n');
  }
//*************************************************** */
nodeToDecide:string;
nodeToDecide2:string;
syncOrAsync:string;
check:string[]=['sync','async'];
check1:string[]=['eventProducer','topic']
evtop:string;
  showRoot(name: string, name2:string): void {
    console.log("show root:"+ name, name2);
    const cypherQuery = `MATCH p = shortestPath((issuer:MyNode {name: '${name}'})-[:CALLS*]->(target:MyNode {name: '${name2}'})) RETURN p`;
    this.changeCypherQuery(cypherQuery);
  }

  showNodesRelations(name: string): void {
    console.log("showConx: "+ name);
    this.changeCypherQuery(`MATCH p=(n:MyNode {name: '${name}'})-[:CALLS]-(m) RETURN DISTINCT p`);
  }
//************************************************************************************* */
  showOnlySync(): void {
    this.changeCypherQuery('MATCH (a:MyNode)-[r:CALLS {type: "sync"}]->(b:MyNode) RETURN a, r, b');
  }

  showOnlyAsync(): void {
    this.changeCypherQuery('MATCH (a:MyNode)-[r:CALLS {type: "async"}]->(b:MyNode) RETURN a, r, b');
  }
////********************************************************************************************************* */
retrieveNodes(): void {
  this.nodeService.getAllNodesNames().subscribe((res: string[]) => {
    this.nodeOptions = res; // Populate nodeOptions with data from the service
    this.filteredNodes = this.nodeOptions; // Initially display all nodes
  });
}



nodesForChoice:string[];
retrieveAllRelations(name: string):void{
this.nodeService.getAllRelation(name).subscribe((res: string[])=> {
  
  this.nodesForChoice = res;
})
}
  // retrieveNodeTypes(): void {
  //   this.nodeService.getAllNodes().subscribe((res: Node[]) => {
  //     this.nodeTypes = Array.from(new Set(res.map(node => node.type)));
      
  //   });
  // }
api:string[];
eventProducer:string[];
topic:string[];
  retrieveApi(): void {
    this.callsService.getAllCalls().subscribe((res: Call[]) => {
      this.api = Array.from(new Set(res.map(call => call.api))).filter(api => api !== null);
    });
  }
  retrieveEventProducer(): void {
    this.callsService.getAllCalls().subscribe((res: Call[]) => {
      this.eventProducer = Array.from(new Set(res.map(call => call.eventProduced))).filter(eventProducer => eventProducer !== null);
    });
  }
  retrieveTopic(): void {
    this.callsService.getAllCalls().subscribe((res: Call[]) => {
      this.topic = Array.from(new Set(res.map(call => call.topic))).filter(topic => topic !== null);
    });
  }
  //***************************************************************** */
  
  filterByNodeType(type: string): void {
    const cypherQuery = `MATCH (n:MyNode {type: '${type}'}) RETURN n`;
    this.changeCypherQuery(cypherQuery);
  }

  //**************************************************** */

  searchByAPI(api: string): void {
    const cypherQuery = `MATCH (n:MyNode)-[r:CALLS* {api: '${api}'}]->(m:MyNode) RETURN n, r, m`;
    this.changeCypherQuery(cypherQuery);
  }

  searchByEventProducer(eventProducer: string): void {
    
    const cypherQuery = `MATCH (n:MyNode)-[r:CALLS* {eventProduced: '${eventProducer}'}]->(m:MyNode) RETURN n, r, m`;
    this.changeCypherQuery(cypherQuery);
    
  }

  searchByTopic(topic: string): void {
    const cypherQuery = `MATCH (n:MyNode)-[r:CALLS* {topic: '${topic}'}]->(m:MyNode) RETURN n, r, m`;
    this.changeCypherQuery(cypherQuery);
  }

  onNodeTypeChange(selectedType: string): void {
    this.selectedNodeType = selectedType;
   
  }
//isplay , zoom , popup and isSmooth
  onZoomChange(event: Event): void {
    const zoomLevel = (event.target as HTMLInputElement).valueAsNumber;
    if (this.neoVis) {
      (this.neoVis as any).network.moveTo({ scale: zoomLevel });
    }
  }
  isplay = true; // Initial value of the boolean
  togglePhysics(): void {
    this.isplay = !this.isplay;
    if (this.neoVis && this.neoVis.network) {
      this.neoVis.network.setOptions({ physics: this.isplay });
    }
  }
  isSmooth = true; // Initial value of the boolean
  switchEdges(): void {
    
    console.log("straight: "+this.isSmooth);
    if (this.neoVis && this.neoVis.network) {
      this.neoVis.network.setOptions({ edges:{smooth:this.isSmooth} });
    }
    if(this.syncOrAsync=="sync"){
      this.showOnlySync();
    }else if(this.syncOrAsync=="async"){
      this.showOnlyAsync();
    }else{this.refreshVisualization();}
    
  }
// popup control
@ViewChild('popupContainer', { static: false }) popupContainer!: ElementRef;
isPopupVisible = false;
isDragging = false;
offsetX = 0;
offsetY = 0;
initialX = 0;
initialY = 0;

togglePopup() {
  this.isPopupVisible = !this.isPopupVisible;
}





//dynamic search
  selectedApi: string = 'all';
  selectedEventProducer: string = 'all';
  selectedTopic: string = 'all';
  searchTerm: string = '';
  //for menu under input
  searchForm: FormGroup;
  searchControl: FormControl;
  filteredNodes: string[] = [];
  allNodes: string[] = this.nodeOptions;
  
  onSearch(value: string): void {
    this.searchTerm = value;
    this.filterSuggestions();
    this.updateGraph();
  }
  

onApiFilter(event: any): void {
  this.selectedApi = event.target.value;
  this.updateGraph();
}

onEventProducerFilter(event: any): void {
  this.selectedEventProducer = event.target.value;
  this.updateGraph();
}

onTopicFilter(event: any): void {
  this.selectedTopic = event.target.value;
  this.updateGraph();
}

buildCypherQuery(): string {
  let query = 'MATCH (n)-[r]->(m) WHERE 1=1';

  // Add search term condition if provided
  if (this.searchTerm) {
    query += ` AND n.name CONTAINS '${this.searchTerm}'`;
  }

  // Handle syncOrAsync filtering
  if (this.syncOrAsync === 'sync' || this.syncOrAsync === 'async') {
    query += ` AND r.type = '${this.syncOrAsync}'`;
    
    // Add API filtering if selected
    if (this.syncOrAsync === 'sync' && this.selectedApi !== 'all') {
      query += ` AND r.api = '${this.selectedApi}'`;
    }
    
    // Add event producer and topic filtering if selected
    if (this.syncOrAsync === 'async') {
      if (this.selectedEventProducer !== 'all') {
        query += ` AND r.eventProduced = '${this.selectedEventProducer}'`;
      }
      if (this.selectedTopic !== 'all') {
        query += ` AND r.topic = '${this.selectedTopic}'`;
      }
    }
  }
  
  // Handle case where all types should be included
  if (this.syncOrAsync === 'all') {
    query += ''; // No additional filtering for all types
  }

  // Add RETURN clause and limit results
  query += ' RETURN DISTINCT n, r, m ';

  return query;
}

updateGraph(): void {
  this.neoVis.clearNetwork(); // Clears the current visualization
  this.neoVis.updateWithCypher(this.buildCypherQuery()); // Update with new Cypher query
}
//for filter under input
nodeSync:string[];
nodeAsync:string[];
private _filter(value: string): string[] {
  const filterValue = value.toLowerCase();
  
  this.nodeService.getAsyncNode().subscribe((res: string[]) => {
    
    this.nodeAsync = res;
  });
  this.nodeService.getSyncNode().subscribe((res: string[]) => {
    
    this.nodeSync = res;
  });
  console.log(this.syncOrAsync);
    
    
    // Add API filtering if selected
    if (this.syncOrAsync === 'sync' ) {
    this.filteredNodes= this.nodeSync.filter(node => node.toLowerCase().includes(filterValue));
    }
    
    // Add event producer and topic filtering if selected
   else if (this.syncOrAsync === 'async') {
     this.filteredNodes= this.nodeAsync.filter(node => node.toLowerCase().includes(filterValue));
    }
  
  
  // Handle case where all types should be included
 else if (this.syncOrAsync === 'all') {
   this.filteredNodes =this.nodeOptions.filter(node => node.toLowerCase().includes(filterValue));
  }
  return this.filteredNodes;
}

filterSuggestions(): void {
  this.filteredNodes = this._filter(this.searchTerm);
}

}
