import { Component } from '@angular/core';
import { ModalComponent } from './modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { FormControl, FormGroup } from '@angular/forms';
import { TuiAccordionComponent, TuiAccordionItemComponent } from '@taiga-ui/kit';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MyApp';

  testForm = new FormGroup({
    testValue: new FormControl(""),
  });

  visitedRepos: string[] = ["/"];

  authorized: boolean = false;
  sidebarOpened: boolean = false;
  modalRef: MdbModalRef<ModalComponent> | null = null;

  constructor(private modalService: MdbModalService) {}

  onClick(event: MouseEvent): void {
    this.sidebarOpened = !this.sidebarOpened;
  }

  openLoginModal() {
    this.modalRef = this.modalService.open(ModalComponent, { data: { formType: 0, mainButtonText: "Войти" }});
  }

  openSignupModal() {
    this.modalRef = this.modalService.open(ModalComponent, { data: { formType: 1, mainButtonText: "Зарегистрироваться" }});
  }

  openSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
  }

}
