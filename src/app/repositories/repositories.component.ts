import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { RepoRequestService } from '../repo-request.service';
import { TransferDataService } from '../transfer-data.service';
import { Repository } from '../Repository';
import { TUI_ARROW } from '@taiga-ui/kit';

@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepositoriesComponent {
  repoRequestService: RepoRequestService;
  repoList: Array<Repository> = [];
  tableRepoList: Array<Repository> = []; 
  activeAccessLevelTab: number = 1;
  activeFormatTab: number = 0;

  arrow = TUI_ARROW;
  columns = ['name', 'isPublic', 'tags', 'creator', 'description', 'actions'];

  constructor(repoRequestService: RepoRequestService, private cdr: ChangeDetectorRef, private dataService: TransferDataService) {
    this.repoRequestService = repoRequestService;
  }
  
  ngOnInit() {
    this.showAvailablePrivateRepositories();
  }

  showAvailablePrivateRepositories() {
    this.repoRequestService.getAvailablePrivateRepos().subscribe({next:(data: Repository[]) => { this.repoList = data; this.cdr.detectChanges(); }});
  }

  showGlobalRepositories() {
    this.repoRequestService.getGlobalRepos().subscribe({next:(data: Repository[]) => { this.repoList = data; this.cdr.detectChanges(); }});
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

  passInfo(repo: Repository) {
    this.dataService.updateCurrentData(repo);
  }

  // remove(item: Repository): void {
  //   this.repoList = this.repoList.filter(repo => repo !== item);
  // }

}
