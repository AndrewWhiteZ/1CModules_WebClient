import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RepoRequestService } from '../repo-request.service';
import { Repository } from '../Repository';
import { Module } from '../Module';
import { Commit } from '../Commit';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {

  repoList: Repository[] = [];
  routeParams: string[] = [];
  activeSearchSubjectIndex: number = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute, 
    private repoRequest: RepoRequestService) {}

  ngOnInit() {
    this.activeSearchSubjectIndex = 0;
    this.route.queryParams.subscribe((params: any) => {
      this.routeParams = params.tag;
      this.searchRepos();
    });
  }

  searchRepos() {
    if(this.routeParams.length > 0) {
      this.repoRequest.globalRepoSearch({ 'tags': this.routeParams }).subscribe((data: any) => {
        this.repoList = data["data"]["results"];
        this.cdr.detectChanges();
      });
    }
  }
}
