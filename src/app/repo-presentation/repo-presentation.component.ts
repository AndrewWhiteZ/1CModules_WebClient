import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { RepoRequestService } from '../repo-request.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Module } from '../Module';
import { EMPTY_ARRAY, TuiHandler } from '@taiga-ui/cdk';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { CommitShort } from '../CommitShort';
import { Commit } from '../Commit';
import { TUI_PROMPT, TuiPromptData } from '@taiga-ui/kit';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-repo-presentation',
  templateUrl: './repo-presentation.component.html',
  styleUrls: ['./repo-presentation.component.scss']
})
export class RepoPresentationComponent {

  activeOutputFormat: number = 0;
  repoId: string = '';
  currentPath: string[] = [];
  modulesList: Array<Module> = [];
  commitsList: Array<Commit> = [];

  fileSearchForm = new FormGroup({
    fileSearchValue: new FormControl("", Validators.nullValidator),
  });

  commitSearchForm = new FormGroup({
    commitSearchValue: new FormControl("", Validators.nullValidator),
  });


  data: Module = {
    name: 'root',
    type: 'folder',
    lastCommit: new CommitShort('_1', 'root_commit', new Date()),
    locked: false,
    files: this.modulesList,
  }

  constructor(
    private router: Router, 
    private repoRequestService: RepoRequestService,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,) {}

  ngOnInit() {
    this.repoId = this.router.url.split("/").pop()!;
    this.showModules();
  }

  openAccordionItem(module: Module) {
    this.currentPath = [module.name];
    if(module.type == 'file') this.showCommits();
  }

  showModules() {
    this.repoRequestService.getModulesByRepoId(this.repoId).subscribe({next:(data: Module[]) => { 
      this.modulesList = data;
      this.data.files = this.modulesList;
    }});
  }

  showCommits() {
    this.repoRequestService.getCommitsByRepoModule(this.repoId, this.currentPath.join('/')).subscribe({next:(data: Commit[]) => {
      this.commitsList = data;
    }});
  }

  lockFile(event: MouseEvent, module: Module): void {
    event.stopPropagation();

    const data: TuiPromptData = {
      content: `Вы действительно хотите захватить файл <b>${module.name}</b>?`,
      yes: 'Да, захватить',
      no: 'Отмена',
    };

    this.dialogs.open<boolean>(TUI_PROMPT, {
      label: "",
      size: "m",
      data,
    })
    .subscribe(response => {
      if(response) {
        this.repoRequestService.lockModule(this.repoId, module.name).subscribe(data => {
          this.alerts.open(`Файл <b>${module.name}</b> успешно захвачен`, { 
            label: 'Захвачен', 
            status: TuiNotification.Success, 
            autoClose: false
          }).subscribe();
          this.showModules();
          module.locked = true;
        });
      }
    });
  }

  unlockFile(event: MouseEvent, module: Module): void {
    event.stopPropagation();

    const data: TuiPromptData = {
      content: `Вы действиетльно хотите снять захват с файла <b>${module.name}</b>?`,
      yes: 'Да, снять захват',
      no: 'Отмена',
    };

    this.dialogs.open<boolean>(TUI_PROMPT, {
      label: "",
      size: "m",
      data,
    })
    .subscribe(response => {
      if(response) {
        this.repoRequestService.unlockModule(this.repoId, module.name).subscribe(data => {
          this.alerts.open(`Захват с файла <b>${module.name}</b> успешно снят`, { 
            label: 'Захват снят', 
            status: TuiNotification.Success, 
            autoClose: false
           }).subscribe();
           module.locked = false;
        });
      }
    });
  }

  downloadLastCommit(module: Module): void {

  }

  editFile(module: Module): void {

  }

  infoFile(module: Module): void {

  }

  deleteFile(module: Module): void {

  }

  commit(event: MouseEvent): void {

  }

  moveToParentDirectory(event: MouseEvent): void {

  }

  moveToChildDirectory(module: Module): void {
    
  }

  readonly handler: TuiHandler<Module, readonly Module[]> = item => item.files || EMPTY_ARRAY;
}
