import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:8081/api/v1/email/send';

  constructor(private http: HttpClient) { }

  sendFeedback(feedback: { name: string, message: string }): Observable<any> {
    return this.http.post(this.apiUrl, feedback);
  }
}
