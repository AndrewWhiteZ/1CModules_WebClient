import { Component, ChangeDetectorRef } from '@angular/core';
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
  activeAccessLevelTab: number = 1;
  activeFormatTab: number = 0;

  readonly columns = ['name', 'isPublic', 'tags', 'actions'];

  constructor(repoRequestService: RepoRequestService, private cdr: ChangeDetectorRef) {
    this.repoRequestService = repoRequestService;
  }
  
  ngOnInit() {
    this.showAvailablePrivateRepositories();
  }

  showAvailablePrivateRepositories() {
    this.repoRequestService.getAvailablePrivateRepos().subscribe({next:(data: Repository[]) => { this.repoList = data; }});
  }

  showGlobalRepositories() {
    this.repoRequestService.getGlobalRepos().subscribe({next:(data: Repository[]) => { this.repoList = data; }});
  }

  onAccessLevelTabChange():void {
    if (this.activeAccessLevelTab == 1) {
      this.showAvailablePrivateRepositories();
    } else if (this.activeAccessLevelTab == 0) {
      this.showGlobalRepositories();
    }
    this.cdr.detectChanges();
  }

  onFormatTabChange(event: any):void {
    this.activeFormatTab = event.index;
    this.cdr.detectChanges();
  }

}
