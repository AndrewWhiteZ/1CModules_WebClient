import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-repo-edit',
  templateUrl: './repo-edit.component.html',
  styleUrls: ['./repo-edit.component.scss']
})
export class RepoEditComponent {

  repoId: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.repoId = this.router.url.split("/").pop()!;
  }

  getRepoInfo() {

  }

}
