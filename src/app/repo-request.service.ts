import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Repository } from './Repository';
import { Module } from './Module';
import { Commit } from './Commit';
import { User } from './User';
import { map } from 'rxjs/operators';
import { AccessLevel } from './AccessLevel';
import { Profile } from './Profile';

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

  getRepoInfo(repoId: string) {
    return this.http.get(`/api/v1/repos/${repoId}`);
  }

  getRepoProfiles(repoId: string) {
    return this.http.get(`/api/v1/repos/${repoId}/users`).pipe(map((data: any) => {

      let dataList = data["data"];

      return dataList.map(function(profile: any): Profile {
        let user = profile["user"];
        let accessLevel = profile["accessLevel"];
        return new Profile(
          new User(user.id, user.username, user.fullName, user.createdOn, null), 
          new AccessLevel(accessLevel.canView, accessLevel.canCommit, accessLevel.canManage, accessLevel.roleName)
        );
      });
    }));
  }

  getCommitsByRepoModule(repoId: string, pathToModule: string): Observable<Commit[]> {
    return this.http.get(`/api/v1/repos/${repoId}/commits/${pathToModule}`).pipe(map((data: any) => {
      let commitsList = data["data"];
      return commitsList.map(function(commit: any): Commit {
        return new Commit(commit.id, commit.message, commit.tags, commit.author, commit.when);
      });
    }));
  }

  lockModule(repoId: string, pathToModule: string): Observable<any> {
    return this.http.post(`/api/v1/repos/${repoId}/lock/${pathToModule}`, {});
  }

  unlockModule(repoId: string, pathToModule: string): Observable<any> {
    return this.http.delete(`/api/v1/repos/${repoId}/lock/${pathToModule}`, {});
  }

  getModuleLastCommitInfo(repoId: string, pathToModule: string) {
    return this.http.get(`/api/v1/repos/${repoId}/files/${pathToModule}`);
  }

  getModuleCommitInfo(repoId: string, pathToModule: string, version: string) {
    return this.http.get(`/api/v1/repos/${repoId}/files/${pathToModule}?rev=${version}`);
  }

  downloadCommit(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob'
    })
  }

  // downloadCommit(repoId: string, pathToModule: string, version: string = '') {
  //   return this.http.get(`/api/v1/repos/${repoId}/files/${pathToModule}?rev=${version}`)
  // }

}
