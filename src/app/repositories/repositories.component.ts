import { Component } from '@angular/core';
import { RepoRequestService } from '../repo-request.service';
import { Repository } from '../Repository';

@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.scss']
})
export class RepositoriesComponent {

  repoRequestService: RepoRequestService;

  repoList: Array<Repository> = [];

  constructor(repoRequestService: RepoRequestService) {
    this.repoRequestService = repoRequestService;
  }
  
  ngOnInit() {
    this.showAvailablePrivateRepositories();
  }


  showAvailablePrivateRepositories() {
    this.repoRequestService.getAvailablePrivateRepos().subscribe({next:(data: Repository[]) => this.repoList = data});   
  }

}
