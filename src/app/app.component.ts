import { Component } from '@angular/core';
import { ModalComponent } from './modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MyApp';

  sidebarOpened: boolean = false;
  modalRef: MdbModalRef<ModalComponent> | null = null;

  constructor(private modalService: MdbModalService) {}

  openSignupModal() {
    this.modalRef = this.modalService.open(ModalComponent, { data: { formType: 1, title: "Регистрация", mainButtonText: "Зарегистрироваться" }});
  }

  openLoginModal() {
    this.modalRef = this.modalService.open(ModalComponent, { data: { formType: 0, title: "Авторизация", mainButtonText: "Войти" }});
  }

  openSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
  }

}
