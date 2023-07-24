import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RepoRequestService } from '../repo-request.service';
import { Module } from '../Module';

@Component({
  selector: 'app-repo-presentation',
  templateUrl: './repo-presentation.component.html',
  styleUrls: ['./repo-presentation.component.scss']
})
export class RepoPresentationComponent {

  repoId: string = '';
  modulesList: Array<Module> = [];

  constructor(private router: Router, private repoRequestService: RepoRequestService) {}

  ngOnInit() {
    this.repoId = this.router.url.split("/").pop()!;
    this.showModules();
  }

  showModules() {
    this.repoRequestService.getModulesByRepoId(this.repoId).subscribe({next:(data: Module[]) => { this.modulesList = data; }});
  }

}
