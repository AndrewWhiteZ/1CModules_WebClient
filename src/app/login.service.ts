import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthRequest } from './auth-request';
import { RegRequest } from './reg-request';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  authorize(request: AuthRequest): Observable<any> {
    return this.http.post("api/v1/login", request, { headers: { "Content-Type": "application/json" } });
  }

  register(request: RegRequest): Observable<any> {
    return this.http.post("api/v1/register", request, { headers: { "Content-Type": "application/json" } });
  }

  logout() {
    return this.http.get("api/v1/logout");
  }
}
