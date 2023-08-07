import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ProfileRequestService } from '../profile-request.service';
import { Router } from '@angular/router';
import { User } from '../User';
import { Repository } from '../Repository';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  user: User = new User("ID пользователя", "Логин", "Полное имя", new Date(), "Адрес электронной почты");
  userPublicRepoList: Repository[] = [];

  constructor(private cdr: ChangeDetectorRef, private profileService: ProfileRequestService, private router: Router) {
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
      this.cdr.detectChanges();
    });
  }
}
