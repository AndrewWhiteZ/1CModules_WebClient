import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { User } from '../User';
import { Repository } from '../Repository';
import { ProfileRequestService } from '../profile-request.service';
import { TUI_PROMPT, TUI_ARROW, TuiPromptData } from '@taiga-ui/kit';
import { TransferDataService } from '../transfer-data.service';
import { TuiAlertService, TuiDialogService, TuiNotification, TuiDialogContext, TuiDialogSize } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { RepoRequestService } from '../repo-request.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileComponent {

  radius = 15;
  skeletonVisible = true;

  dialogSubscription: Subscription = new Subscription;
  authorizedUser: User = new User("ID пользователя", "Логин", "Полное имя", new Date(), "Адрес электронной почты");
  userPublicRepoList: Repository[] = [];
  activeFormatTab: number = 0;

  arrow = TUI_ARROW;
  columns = ['name', 'isPublic', 'tags', 'description', 'actions'];

  constructor(
    private cdr: ChangeDetectorRef, 
    private profileService: ProfileRequestService,
    private repoService: RepoRequestService,
    private dataService: TransferDataService,
    @Inject(TuiDialogService) readonly dialogs: TuiDialogService,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    ) {
  }

  ngOnInit() {
    this.profileService.getMyProfileInfo().subscribe((next: User) => { 
      this.authorizedUser = next;
      this.showUserPublicRepos();
    });
  }

  showUserPublicRepos() {
    this.profileService.getProfilePublicRepos(this.authorizedUser.id).subscribe((data: any) => {
      this.userPublicRepoList = data;
      this.skeletonVisible = false;
      this.cdr.detectChanges();
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

  passInfo(repo: Repository) {
    this.dataService.updateCurrentData(repo);
  }

  deleteRepo(repo: Repository) {
    const data: TuiPromptData = {
      content: `Вы действительно хотите удалить репозиторий <b>${repo.name}</b>?`,
      yes: 'Да, удалить репозиторий',
      no: 'Отмена',
    };

    this.dialogs.open<boolean>(TUI_PROMPT, {
      label: "",
      size: "m",
      data,
    }).subscribe(response => {
      if(response) {
        this.repoService.deleteRepo(repo.id).subscribe((data: any) => {
          if(data["status"] == 0) {
            this.alerts.open(`Репозиторий <b>${repo.name}</b> успешно удален`, { 
              label: 'Удален', 
              status: TuiNotification.Success, 
              autoClose: false
            }).subscribe();
            this.dialogSubscription.unsubscribe();
            this.cdr.detectChanges();
          } else {
            this.alerts.open(`${data["message"]}`, { 
              label: 'Ошибка', 
              status: TuiNotification.Error, 
              autoClose: false
            }).subscribe();
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
    });
  }
}
