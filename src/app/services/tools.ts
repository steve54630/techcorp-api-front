import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITool } from '../types/tool';
import { IToolFilter } from './dto/tools.filter.dto';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ToolsService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  getTools(filter: IToolFilter): Observable<ITool[]> {
    let params = new HttpParams({ fromObject: filter as any });
    return this.http.get<ITool[]>(`${this.apiUrl}/tools`, {
      params: params,
    });
  }
}
