import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RepoRequestService } from '../repo-request.service';
import { Module } from '../Module';
import { EMPTY_ARRAY, TuiHandler } from '@taiga-ui/cdk';
import { CommitShort } from '../CommitShort';
import { Commit } from '../Commit';

@Component({
  selector: 'app-repo-presentation',
  templateUrl: './repo-presentation.component.html',
  styleUrls: ['./repo-presentation.component.scss']
})
export class RepoPresentationComponent {

  activeOutputFormat: number = 0;
  repoId: string = '';
  currentPath: string[] = [];
  modulesList: Array<Module> = [];
  commitsList: Array<Commit> = [];

  data: Module = {
    name: 'root',
    type: 'folder',
    lastCommit: new CommitShort('_1', 'root_commit', new Date()),
    locked: false,
    files: this.modulesList,
  }

  constructor(private router: Router, private repoRequestService: RepoRequestService) {}

  ngOnInit() {
    this.repoId = this.router.url.split("/").pop()!;
    this.showModules();
  }

  openAccordionItem(module: Module) {
    this.currentPath = [module.name];
    if(module.type == 'file') this.showCommits();
  }

  showModules() {
    this.repoRequestService.getModulesByRepoId(this.repoId).subscribe({next:(data: Module[]) => { 
      this.modulesList = data;
      this.data.files = this.modulesList;
    }});
  }

  showCommits() {
    this.repoRequestService.getCommitsByRepoModule(this.repoId, this.currentPath.join('/')).subscribe({next:(data: Commit[]) => {
      this.commitsList = data;
    }});
  }

  lockFile(module: Module): void {
    console.log('Locking');
  }

  unlockFile(module: Module): void {
    console.log('Unlocking');
  }

  downloadLastCommit(module: Module): void {

  }

  editFile(module: Module): void {

  }

  infoFile(module: Module): void {

  }

  deleteFile(module: Module): void {

  }

  commit(event: MouseEvent): void {

  }

  moveToParentDirectory(event: MouseEvent): void {

  }

  moveToChildDirectory(module: Module): void {
    
  }

  readonly handler: TuiHandler<Module, readonly Module[]> = item => item.files || EMPTY_ARRAY;
}
