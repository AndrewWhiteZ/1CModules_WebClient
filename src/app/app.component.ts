import { Component, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ModalComponent } from './modal/modal.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext, TuiDialogService, TuiDialogSize, TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { tuiMarkControlAsTouchedAndValidate } from '@taiga-ui/cdk';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { AuthRequest } from './auth-request';
import { LoginService } from './login.service';
import { Observable, Subscription } from 'rxjs';
import { RegRequest } from './reg-request';
import { User } from './User';
import { ProfileRequestService } from './profile-request.service';
import { RepoRequestService } from './repo-request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = '1C Modules';
  dialogSubscription: Subscription = new Subscription;
  open: boolean = false;

  searchForm = new FormGroup({
    searchValue: new FormControl("", Validators.nullValidator),
  });

  authorizedUser: User | null = null;

  visitedRepos: string[] = ["/"];
  activeTab: number = 0;
  authorized: boolean = false;
  sidebarOpened: boolean = false;

  authForm = new FormGroup({
    loginValue: new FormControl(``, Validators.compose([Validators.required, Validators.maxLength(100)])),
    passwordValue: new FormControl(``, Validators.required),
  });

  regForm = new FormGroup({
    usernameValue: new FormControl(``, Validators.required),
    emailValue: new FormControl(``, Validators.compose([Validators.email, Validators.required])),
    fullNameValue: new FormControl(``, Validators.required),
    passwordValue: new FormControl(``, Validators.required),
  });

  constructor(
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService, 
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private loginService: LoginService,
    private profileService: ProfileRequestService,
    private repoService: RepoRequestService) {}

  ngOnInit() {
    this.profileService.getMyProfileInfo().subscribe((data: any) => {
      if(data != null) {
        this.authorizedUser = new User(data["id"], data["username"], data["fullName"], data["createdOn"], null);
        this.cdr.detectChanges();
      }
    });
  }

  onClick(event: MouseEvent): void {
    this.sidebarOpened = !this.sidebarOpened;
  }

  onAuthClick(
    content: PolymorpheusContent<TuiDialogContext>,
    header: PolymorpheusContent,
    size: TuiDialogSize,
  ): void {
    this.dialogSubscription = this.dialogs.open(
      content,
      {
        header,
        size,
      },
    ).subscribe();
  }

  authorize() {
    tuiMarkControlAsTouchedAndValidate(this.authForm);
    this.loginService.authorize(
      new AuthRequest(
        this.authForm.controls.loginValue.value!, 
        this.authForm.controls.passwordValue.value!
        ))
      .subscribe(
        {next: (data: any) => 
          { 
            if (data["status"] == 0) {
              data = data["data"];
              this.dialogSubscription.unsubscribe();
              this.authorizedUser = new User(data["id"], data["username"], data["fullName"], data["createdOn"], null);
              this.alerts.open(`Успешно авторизван под пользователем <b>${data["fullName"]}</b>`, { 
                label: 'Авторизован', 
                status: TuiNotification.Success, 
                autoClose: true
              }).subscribe();
              this.cdr.detectChanges();
            }
            else {
              this.alerts.open('При попытке авторизации произошла ошибка', {label: 'Ошибка'}).subscribe();
            }
          }
        });
  }

  register() {
    tuiMarkControlAsTouchedAndValidate(this.regForm);
    this.loginService.register(
      new RegRequest(
        this.regForm.controls.usernameValue.value!,
        this.regForm.controls.emailValue.value!,
        this.regForm.controls.fullNameValue.value!,
        this.regForm.controls.passwordValue.value!
        ))
      .subscribe(
        {next: (data: any) => 
          { 
            if (data["status"] == 0) {
              data = data["data"];
              this.dialogSubscription.unsubscribe();
              this.authorizedUser = new User(data["id"], data["name"], data["fullName"], data["createdOn"], null);
              this.alerts.open(`Успешно зарегистрирован и авторизован под пользователем <b>${data["fullName"]}</b>`, { 
                label: 'Зарегистрирован', 
                status: TuiNotification.Success, 
                autoClose: false
              }).subscribe();
              this.cdr.detectChanges();
            }
            else {
              this.alerts.open('При попытке регистрации произошла ошибка', {label: 'Ошибка'}).subscribe();
            }
          }
        });
  }

  logout() {
    this.loginService.logout().subscribe(() => {
      this.authorizedUser = null;
    });
  }

  closeDialog() {
    this.dialogSubscription.unsubscribe();
  }

  openSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
  }

  search() {
    this.router.navigate(['/search'], { queryParams: { tag: this.searchForm.controls.searchValue.value } });
  }
}
