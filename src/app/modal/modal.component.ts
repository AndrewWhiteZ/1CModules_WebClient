import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { AbstractControl, FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { AuthRequest } from '../auth-request';
import { RegRequest } from '../reg-request';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  validationForm: FormGroup;

  title: string | null = null;
  mainButtonText: string | null = null;
  cb: Function = Function();
  formType: number = 0;

  constructor(public modalRef: MdbModalRef<ModalComponent>, private loginService: LoginService) {
    if (this.formType == 0) {
      this.validationForm = new FormGroup({
        login: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
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

  //Validators.pattern(new RegExp(`^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{8,20})\S$`))

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
