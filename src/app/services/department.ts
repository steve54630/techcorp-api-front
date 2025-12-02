import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDepartment } from '../types/department';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl

  getDepartments(): Observable<IDepartment[]> {
    return this.http.get<IDepartment[]>(`${this.apiUrl}/departments`);
  }
}
