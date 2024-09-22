import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment.prod';
import { Node } from './node';
@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private apiServerUrl=environment.apiBaseUrl+"/api/v1";
  constructor(private http: HttpClient) { }
  getAllNodes():Observable<Node[]> {
    return this.http.get<Node[]>(`${this.apiServerUrl}/node`);
  }
  getAllNodesNames():Observable<string[]> {
    return this.http.get<string[]>(`${this.apiServerUrl}/node/names`);
  }
  addNode(formData: FormData): Observable<Node> {
    return this.http.post<Node>(`${this.apiServerUrl}/node`,formData);
  }
  deleteNode(name: string) :Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/node/${name}`);
  }

  deleteAll() :Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/node`);
  }

 


  getByName(name:string):Observable<string> {
    
    return this.http.get<string>(`${this.apiServerUrl}/${name}`);
  }




  getNodeNamesWithOneConnection(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiServerUrl}/node/one-connection`);
  }

  getAllRelation(name:string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiServerUrl}/node/allConx/${name}`);
  }

  //callsrelated
  getAsyncNode(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiServerUrl}/node/onlyAsync`);
  }

  getSyncNode(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiServerUrl}/node/onlySync`);
  }
}
