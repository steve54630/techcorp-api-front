import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { ITool } from '../types/tool';
import { IToolFilter } from './dto/tools.filter.dto';
import { environment } from '../../environments/environment.development';
import { IToolResponseDto } from './dto/tools.response.dto';

@Injectable({
  providedIn: 'root',
})
export class ToolsService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;
  private query = new BehaviorSubject<IToolFilter>({ _page: 1, _limit: 10 });
  queryParams$ = this.query.asObservable();

  updateQuery(query: IToolFilter) {
    const currentParams = this.query.getValue();
    const newParams = { ...currentParams, ...query };
    this.query.next(newParams);
  }

  getRecentTools(): Observable<IToolResponseDto> {
    return this.queryParams$.pipe(
      switchMap((params) => {
        let httpParams = new HttpParams({ fromObject: params as any });

        return this.http
          .get<ITool[]>(`${this.apiUrl}/tools`, {
            params: httpParams,
            observe: 'response',
          })
          .pipe(
            map((response) => ({
              tools: response.body!,
              total: +response.headers.get('X-Total-Count')!,
            }))
          );
      })
    );
  }

  getTools(): Observable<IToolResponseDto> {

    return this.http
          .get<ITool[]>(`${this.apiUrl}/tools`, {
            observe: 'response'
          })
          .pipe(
            map((response) => ({
              tools: response.body!,
              total: +response.headers.get('X-Total-Count')!,
            }))
          );

  }

  getCategories(): Observable<string[]> {
    return this.http.get<ITool[]>(`${this.apiUrl}/tools`).pipe(
      map((response) => response.map((tool) => tool.category)),
      map((categories) => Array.from(new Set(categories)).sort())
    );
  }
}
