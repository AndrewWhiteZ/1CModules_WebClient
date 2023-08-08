import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { TUI_PROMPT, TuiPromptData } from '@taiga-ui/kit';
import { TuiAlertService, TuiDialogService, TuiNotification, TuiDialogContext, TuiDialogSize } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { RepoRequestService } from '../repo-request.service'; 
import { Repository } from '../Repository';
import { AccessLevel } from '../AccessLevel';
import { User } from '../User';
import { Profile } from '../Profile';
import { ProfileRequestService } from '../profile-request.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-repo-edit',
  templateUrl: './repo-edit.component.html',
  styleUrls: ['./repo-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepoEditComponent {
  editing = false;

  dialogSubscription: Subscription = new Subscription;
  repoId: string = '';
  routePieces: string[] = [];
  repo: Repository = new Repository('_1', 'repo', 'desc', [''], new User('_1', '', '', new Date(), null), false);
  accessLevel: AccessLevel = new AccessLevel(false, false, false, "UNKNOWN");
  repoProfiles: Profile[] = [];

  availableRoles: Map<string, string> = new Map([['Администратор', 'MANAGER'], ['Участник', 'CONTRIBUTOR'], ['Гость', 'VIEWER']]);
  roles: Array<string> = [...Array.from(this.availableRoles.keys())];

  editRepoForm = new FormGroup({
    nameValue: new FormControl("", Validators.required),
    descriptionValue: new FormControl("", Validators.required),
    tagsValue: new FormControl("", Validators.required),
    isPrivateValue: new FormControl(false, Validators.required),
  });

  addNewUserForm = new FormGroup({
    userIdValue: new FormControl("", Validators.required),
    dropdownValue: new FormControl("", Validators.required),
  });

  constructor(private router: Router, 
    private repoRequest: RepoRequestService, 
    private profileRequest: ProfileRequestService, 
    private cdr: ChangeDetectorRef,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,) { 
  }

  ngOnInit() {
    this.routePieces = this.router.url.split("/");
    this.repoId = this.routePieces[this.routePieces.length - 2];
    this.getRepoInfo();
    this.getRepoProfiles();
  }

  getRepoInfo() {
    this.repoRequest.getRepoInfo(this.repoId).subscribe((data: any) => {
      this.repo = data["data"]["repo"];
      this.repo.creator = data["data"]["repo"]["owner"];
      this.accessLevel = data["data"]["myAccessLevel"];
      this.cdr.detectChanges();
    });
  }

  getRepoProfiles() {
    this.repoRequest.getRepoProfiles(this.repoId).subscribe((data: any) => {
      this.repoProfiles = data;
      this.cdr.detectChanges();
    });
  }

  addNewUser() {
    this.profileRequest.addNewUser(this.repoId, 
      this.addNewUserForm.controls.userIdValue.value!, 
      this.availableRoles.get(this.addNewUserForm.controls.dropdownValue.value!)!
    ).subscribe((data: any) => {
      this.repoProfiles = [...data["data"]];
      this.alerts.open(`Пользователь успешно добавлен в репозиторий`, { 
        label: 'Добавлен', 
        status: TuiNotification.Success, 
        autoClose: false
      }).subscribe();
      this.dialogSubscription.unsubscribe();
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

  editRepoRequest() {
    this.repoRequest.patchRepo(this.repoId, { 
      "repoName": this.editRepoForm.controls.nameValue.value,
      "description": this.editRepoForm.controls.descriptionValue.value,
      "tags": this.editRepoForm.controls.tagsValue.value,
      "isPrivate": this.editRepoForm.controls.isPrivateValue.value,
    }).subscribe((data: any) => {
      if(data["status"] == 0) {
        this.alerts.open(`Репозиторий <b>${this.repo.name}</b> успешно изменён`, {
          label: 'Изменен', 
          status: TuiNotification.Success, 
          autoClose: false
        }).subscribe();
        this.repo = data["data"];
        this.dialogSubscription.unsubscribe();
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

  removeUserFromRepo(profile: Profile, index: number) {
    const data: TuiPromptData = {
      content: `Вы действительно хотите удалить пользователя <b>${profile.user.fullName}</b> из репозитория?`,
      yes: 'Да, удалить пользователя',
      no: 'Отмена',
    };

    this.dialogs.open<boolean>(TUI_PROMPT, {
      label: "",
      size: "m",
      data,
    })
    .subscribe(response => {
      if(response) {
        this.profileRequest.removeUserFromRepo(this.repoId, profile.user.id).subscribe((data: any) => {
          if(data["status"] == 0) {
            this.alerts.open(`Пользователь <b>${profile.user.fullName}</b> успешно удален из списка пользователей репозитория`, { 
              label: 'Удален', 
              status: TuiNotification.Success, 
              autoClose: false
            }).subscribe();
            this.dialogSubscription.unsubscribe();
            this.repoProfiles.splice(index, 1);
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

  createNewUser( 
    content: PolymorpheusContent<TuiDialogContext>,
    size: TuiDialogSize): void
  {
    this.dialogSubscription = this.dialogs.open(
      content,
      {
        label: 'Добавление пользователя',
        size,
      },
    ).subscribe();
  }

  editRepo(
    content: PolymorpheusContent<TuiDialogContext>,
    size: TuiDialogSize): void
  {
    this.dialogSubscription = this.dialogs.open(
      content,
      {
        label: 'Изменение репозитория',
        size,
      },
    ).subscribe();
  }

  closeDialog() {
    this.dialogSubscription.unsubscribe();
  }
}
