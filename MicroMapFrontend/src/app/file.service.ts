import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.prod';
import { Observable } from 'rxjs';
import { Call } from './call';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private apiServerUrl=environment.apiBaseUrl+"/api/v1";
  constructor(private http: HttpClient) { }
  
  exportCalls(): Observable<Blob> {
    return this.http.get(`${this.apiServerUrl}/file/download/call`, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
  exportNodes(): Observable<Blob> {
    return this.http.get(`${this.apiServerUrl}/file/download/node`, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
  importNodes(formData: FormData): Observable<void>{
    return this.http.post<void>(`${this.apiServerUrl}/file/insert/nodes`,formData);
  }
  importCalls(formData: FormData): Observable<void>{
    return this.http.post<void>(`${this.apiServerUrl}/file/insert/calls`,formData);
  }
 
}
