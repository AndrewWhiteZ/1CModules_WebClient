import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { User } from '../User';
import { ProfileRequestService } from '../profile-request.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileComponent {

  authorizedUser: User = new User("ID пользователя", "Логин", "Полное имя", new Date(), "Адрес электронной почты");

  constructor(private cdr: ChangeDetectorRef, private profileService: ProfileRequestService) {
  }

  ngOnInit() {
    this.profileService.getMyProfileInfo().subscribe((next: User) => { 
      this.authorizedUser = next;
      this.cdr.detectChanges();
    });
  }

}
