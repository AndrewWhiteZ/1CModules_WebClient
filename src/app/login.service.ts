import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Repository } from './Repository';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthRequest } from './auth-request';
import { RegRequest } from './reg-request';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  httpResponseHandler(observable: Observable<any>): any {
    return observable.subscribe(next => {
      if (next["status"] <= 300) {
        return next["data"];
      } else {
        return null;
      }
    });
  }

  authorize(request: AuthRequest): Observable<any> {
    // return this.http.post("api/v1/login", request, { headers: { "Content-Type": "application/json" } }).pipe(map((next: any) => {
    //   if (next["status"] < 300) {
    //     return next["data"];
    //   }
    // }));
    return this.http.post("api/v1/login", request, { headers: { "Content-Type": "application/json" } });
  }

  register(request: RegRequest): Observable<any> {
    //return this.httpResponseHandler(this.http.post("api/v1/register", request, { headers: { "Content-Type": "application/json" } }));
    return this.http.post("api/v1/register", request, { headers: { "Content-Type": "application/json" } });
  }

}
