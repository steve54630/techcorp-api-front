import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import IAnalytics from '../types/analytics';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl

  getAnalytics() : Observable<IAnalytics>{
    return this.http.get<IAnalytics>(`${this.apiUrl}/analytics`);
  }
  
}
