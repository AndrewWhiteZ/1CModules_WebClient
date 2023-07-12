import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Repository } from './Repository';
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

  // getAvailablePrivateRepositories(): Array<Repository> {

  //   data: JSON = this.httpResponseHandler(this.http.get(""));
   
  //   repoList: new Array<Repository>;

  //   data.forEach(element => {
      
  //     newRepo: Repository = new Repository(element["name"]);
  //     repoList

  //   });

  //   return repoList;

  // }

  getAvailablePrivateRepos() : Observable<Repository[]> {
    return this.http.get('http://185.20.225.206/api/v1/me/repos').pipe(map((data:any)=>{
        let repoList = data["data"];
        return repoList.map(function(repo: any): Repository {
            return new Repository(repo.name);
          });
    }));
  }

}
