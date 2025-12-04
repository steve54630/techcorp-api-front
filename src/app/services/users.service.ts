import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserFilter } from './dto/user.filter.dto';
import { Observable } from 'rxjs';
import { IUserResponse } from './dto/user.response.dto';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  getUsers(filter: IUserFilter): Observable<IUserResponse[]> {
    let params = new HttpParams({ fromObject: filter as any });

    return this.http.get<IUserResponse[]>(`${this.apiUrl}/users`, {
      params: params,
    });
  }
}
