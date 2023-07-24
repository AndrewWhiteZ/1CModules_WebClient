import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Repository } from './Repository';
import { Module } from './Module';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RepoRequestService {

  constructor(private http: HttpClient) { 

  }

  httpResponseHandler(observable: Observable<any>): any {
    return observable.subscribe(next => {
      if (next["status"] <= 300) {
        return JSON.parse(next["data"]);
      }
    });
  }

  getAvailablePrivateRepos(): Observable<Repository[]> {
    return this.http.get('api/v1/me/repos').pipe(map((data: any) => {
      let repoList = data["data"];
      return repoList.map(function(repo: any): Repository {
          return new Repository(repo.id, repo.name, repo.description, repo.tags, repo.owner, repo.public);
        });
    }));
  }

  getGlobalRepos(): Observable<Repository[]> {
    return this.http.get('api/v1/repos').pipe(map((data: any) => {
      let repoList = data["data"];
      return repoList.map(function(repo: any): Repository {
          return new Repository(repo.id, repo.name, repo.description, repo.tags, repo.owner, repo.public);
        });
    }));
  }

  getModulesByRepoId(repoId: string): Observable<Module[]> {
    return this.http.get(`/api/v1/repos/${repoId}/files`).pipe(map((data: any) => {
      let modulesList = data["data"]["files"];
      return modulesList.map(function(module: any): Module {
        return new Module(module.name, module.type, module.lastCommit, module.locked, module.files);
      });
    }));
  }

}
