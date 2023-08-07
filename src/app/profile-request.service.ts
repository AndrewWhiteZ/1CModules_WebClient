import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './User';
import { Repository } from './Repository';

@Injectable({
  providedIn: 'root'
})
export class ProfileRequestService {

  constructor(private http: HttpClient) {
  }

  httpResponseHandler(observable: Observable<any>): any {
    return observable.subscribe(next => {
      if (next["status"] <= 300) {
        return JSON.parse(next["data"]);
      }
    });
  }

  getMyProfileInfo(): Observable<User> {
    return this.http.get('/api/v1/me').pipe(map((data: any) => {
      let profile = data["data"];
      return new User(profile["id"], profile["username"], profile["fullName"], profile["createdOn"], profile["email"])
    }));
  }

  getProfileInfoByUserId(userId: string): Observable<User> {
    return this.http.get(`/api/v1/users/${userId}`).pipe(map((data: any) => {
      let profile = data["data"];
      return new User(profile["id"], profile["username"], profile["fullName"], profile["createdOn"], null);
    }));
  }

  getProfilePublicRepos(userId: string): Observable<Repository[]> {
    return this.http.get(`/api/v1/users/${userId}/repos`).pipe(map((data: any) => {
      let repoList = data["data"];
      return repoList.map(function(repo: any): Repository {
          return new Repository(repo.id, repo.name, repo.description, repo.tags, repo.owner, repo.public);
        });
    }));
  }

  addNewUser(repoId: string, userId: string, role: string) {
    return this.http.post(`/api/v1/repos/${repoId}/users`, {'userId': userId, 'role': role});
  }

  removeUserFromRepo(repoId: string, userId: string): Observable<any> {
    return this.http.delete(`/api/v1/repos/${repoId}/users/${userId}`);
  }
}
