import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl

  getAnalytics() {
    return this.http.get(`${this.apiUrl}/analytics`);
  }
  
}
