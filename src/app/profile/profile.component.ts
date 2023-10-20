import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { ProfileRequestService } from '../profile-request.service';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { Router } from '@angular/router';
import { User } from '../User';
import { Repository } from '../Repository';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent {

  radius: number = 15;
  skeletonVisible: boolean = true;

  user: User = new User("ID пользователя", "Логин", "Полное имя", new Date(), "Адрес электронной почты");
  userPublicRepoList: Repository[] = [];

  constructor(
    private cdr: ChangeDetectorRef, 
    private profileService: ProfileRequestService, 
    private router: Router,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,) {
  }

  ngOnInit() {
    this.user.id = this.router.url.split("/").pop()!
    this.profileService.getProfileInfoByUserId(this.user.id).subscribe((next: User) => { 
      this.user = next;
      this.showUserPublicRepos();
    });
  }

  showUserPublicRepos() {
    this.profileService.getProfilePublicRepos(this.user.id).subscribe((data: any) => {
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
}
