import { Component, ChangeDetectorRef, ChangeDetectionStrategy, Inject, OnInit } from '@angular/core';
import { RepoRequestService } from '../repo-request.service';
import { TransferDataService } from '../transfer-data.service';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { TuiAlertService, TuiDialogService, TuiNotification, TuiDialogContext, TuiDialogSize } from '@taiga-ui/core';
import { Repository } from '../Repository';
import { TUI_ARROW } from '@taiga-ui/kit';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepositoriesComponent implements OnInit {

  radius: number = 15;
  skeletonVisible: boolean = true;

  dialogSubscription: Subscription = new Subscription;
  repoList: Array<Repository> = [];
  tableRepoList: Array<Repository> = []; 
  activeAccessLevelTab: number = 1;
  activeFormatTab: number = 0;

  arrow = TUI_ARROW;
  columns = ['name', 'isPublic', 'tags', 'creator', 'description', 'actions'];

  createRepoForm = new FormGroup({
    nameValue: new FormControl("", Validators.required),
    descriptionValue: new FormControl("", Validators.required),
    tagsValue: new FormControl("",),
    isPrivateValue: new FormControl(false,),
  });

  constructor(
    private cdr: ChangeDetectorRef, 
    private dataService: TransferDataService,
    private repoRequestService: RepoRequestService,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,) {
  }
  
  ngOnInit(): void {
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

  createNewRepo(
    content: PolymorpheusContent<TuiDialogContext>,
    size: TuiDialogSize): void
  {
    this.dialogSubscription = this.dialogs.open(
      content,
      {
        label: 'Создание репозитория',
        size,
      },
    ).subscribe();
  }

  createRepoRequest() {
    this.repoRequestService.createRepo({ 
      "repoName": this.createRepoForm.controls.nameValue.value,
      "description": this.createRepoForm.controls.descriptionValue.value,
      "tags": this.createRepoForm.controls.tagsValue.value,
      "isPrivate": this.createRepoForm.controls.isPrivateValue.value,
    }).subscribe((data: any) => {
      if(data["status"] == 0) {
        this.alerts.open(`Репозиторий успешно создан`, {
          label: 'Создан', 
          status: TuiNotification.Success, 
          autoClose: false
        }).subscribe();
        this.dialogSubscription.unsubscribe();
        this.repoList.push(data);
        this.cdr.detectChanges();
      } else {
        this.alerts.open(data["message"], {
          label: 'Ошибка', 
          status: TuiNotification.Error, 
          autoClose: false
        }).subscribe();
        this.dialogSubscription.unsubscribe();
        this.cdr.detectChanges();
      }
    }, (error: any) => {
      error = error["error"];
      this.alerts.open(error["message"], {
        label: 'Ошибка', 
        status: TuiNotification.Error, 
        autoClose: false
      }).subscribe();
      this.cdr.detectChanges();
    });
  }

  closeDialog() {
    this.dialogSubscription.unsubscribe();
  }
}
