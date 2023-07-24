import { Component, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MdbTabsComponent } from 'mdb-angular-ui-kit/tabs';
import { LoginService } from '../login.service';
import { AuthRequest } from '../auth-request';
import { RegRequest } from '../reg-request';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @ViewChild('tabs') tabs: MdbTabsComponent = {} as MdbTabsComponent;
  validationForm: FormGroup;

  title: string | null = null;
  mainButtonText: string | null = null;
  cb: Function = Function();
  formType: number = 0;

  constructor(private cdr: ChangeDetectorRef, public modalRef: MdbModalRef<ModalComponent>, private loginService: LoginService) {
    if (this.formType == 0) {
      this.validationForm = new FormGroup({
        login: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
        email: new FormControl(null),
        password: new FormControl(null, { validators: [Validators.minLength(8), Validators.maxLength(20)], updateOn: 'blur' }),
      }); 
    } else if (this.formType == 1) {
      this.validationForm = new FormGroup({
        login: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
        email: new FormControl(null, { validators: [Validators.minLength(8), Validators.maxLength(20)], updateOn: 'blur' }),
        password: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      });
    } else {
      this.validationForm = new FormGroup({});
    }
  }

  ngAfterViewInit() {
    if (this.formType == 0) {
      this.title = "Авторизация";
      this.tabs.setActiveTab(1);
    } else {
      this.title = "Регистрация";
      this.tabs.setActiveTab(0);
    };
    this.cdr.detectChanges();
  }

  activeTabChangeHandler() {
    if (this.formType == 0) {
      this.formType = 1;
      this.title = "Регистрация";
    } else {
      this.formType = 0;
      this.title = "Авторизация";
    }
    this.cdr.detectChanges();
  }

  submitForm() {
    if (this.formType == 0) {
      this.loginService.authorize(new AuthRequest(this.login.value, this.password.value)).subscribe({next: (data: any) => { if (data["status"] < 300) this.modalRef.close() }});
    } else if (this.formType == 1) {
      this.loginService.register(new RegRequest(this.login.value, this.email.value, this.login.value, this.password.value)).subscribe({next: (data: any) => { if (data["status"] < 300) this.modalRef.close() }});
    }
  }

  get login(): AbstractControl {
    return this.validationForm.get('login')!;
  }

  get email(): AbstractControl {
    return this.validationForm.get('email')!;
  }

  get password(): AbstractControl {
    return this.validationForm.get('password')!;
  }
}
