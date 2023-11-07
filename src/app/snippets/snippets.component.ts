import { Component, Inject, OnInit } from '@angular/core';
import { TuiAlertService, TuiDialogContext, TuiDialogService, TuiDialogSize } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Subscription } from 'rxjs';
import { Repository } from '../Repository';
import { RepoRequestService } from '../repo-request.service';

@Component({
  selector: 'app-snippets',
  templateUrl: './snippets.component.html',
  styleUrls: ['./snippets.component.less']
})
export class SnippetsComponent implements OnInit {
  subscription: Subscription = new Subscription;
  activeOutputFormat: number = 0;

  repoList: Array<Repository> = [];
  items: string[] = ['Title1', 'Title2', 'Title3'];

  constructor(
    @Inject(RepoRequestService) private readonly repoService: RepoRequestService,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService
  ) {}

  ngOnInit(): void {
    this.repoService.getAvailablePrivateRepos().subscribe({next:(data: Repository[]) => { this.repoList = data }});
  }

  chooseRepoDialog(content: PolymorpheusContent<TuiDialogContext>, size: TuiDialogSize): void {
    this.subscription = this.dialogs.open(content, { size }).subscribe();
  }

  consoleLog(value: any) {
    console.log(value);
  }
} 
