import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { RepoRequestService } from '../repo-request.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Module } from '../Module';
import { EMPTY_ARRAY, TuiHandler } from '@taiga-ui/cdk';
import { TuiAlertService, TuiDialogService, TuiNotification, TuiDialogContext, TuiDialogSize } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { CommitShort } from '../CommitShort';
import { Commit } from '../Commit';
import { TUI_PROMPT, TuiPromptData } from '@taiga-ui/kit';
import { Subscription, Observable, of, Subject, timer } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { TuiFileLike } from '@taiga-ui/kit';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-repo-presentation',
  templateUrl: './repo-presentation.component.html',
  styleUrls: ['./repo-presentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepoPresentationComponent {

  activeStepperItem: number = 0;
  dialogSubscription: Subscription = new Subscription;
  activeOutputFormat: number = 0;
  maxBreadcrumbElements: number = 2;
  repoId: string = '';
  path: string = '';
  currentPath: string[] = [];
  modulesList: Array<Module> = [];
  commitsList: Array<Commit> = [];

  fileValue = new FormControl();

  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$ = this.fileValue.valueChanges.pipe(
    switchMap(file => (file ? this.makeRequest(file) : of(null))),
  );

  fileSearchForm = new FormGroup({
    fileSearchValue: new FormControl("", Validators.nullValidator),
  });

  commitSearchForm = new FormGroup({
    commitSearchValue: new FormControl("", Validators.nullValidator),
  });

  commitForm = new FormGroup({
    filenameValue: new FormControl(``, Validators.required),
    descriptionValue: new FormControl(),
    commitMessageValue: new FormControl(``, Validators.required),
    commitTagsValue: new FormControl(),
    pathValue: new FormControl(``),
  });

  data: Module = {
    name: '...',
    type: 'directory',
    lastCommit: new CommitShort('_1', 'root_commit', new Date()),
    locked: false,
    files: this.modulesList,
  }

  modulesTree: Module[] = [this.data];

  // readonly file: TuiFileLike = {
  //   name: 'custom.txt',
  // };

  constructor(
    private router: Router, 
    private repoRequestService: RepoRequestService,
    private cdr: ChangeDetectorRef,
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

  chooseItemForUpload(module: Module) {
    console.log(module.name);
    // if(module.type == 'file') {
    //   this.commitForm.setValue({ pathValue: module.name });
    // }
  }

  showModules() {
    this.repoRequestService.getModulesByRepoId(this.repoId).subscribe({next:(data: Module[]) => { 
      this.data.files = data;
      this.modulesTree[0] = { ...this.data };
      this.cdr.detectChanges();
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

  downloadLastCommit(event: MouseEvent, module: Module): void {
    event.stopPropagation();
    
    this.repoRequestService.getModuleLastCommitInfo(this.repoId, module.name).subscribe((data: any) => {
      this.repoRequestService.downloadCommit(String(data["data"]["download"]["url"]).split(".206")[1]).subscribe(blob => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(blob)
        a.href = objectUrl
        a.download = module.name;
        a.click();
        URL.revokeObjectURL(objectUrl);
      });
    });
  }

  downloadCommit(event: MouseEvent, commit: Commit): void {
    event.stopPropagation();
    
    this.repoRequestService.getModuleCommitInfo(this.repoId, this.currentPath.join(), commit.id).subscribe((data: any) => {
      this.repoRequestService.downloadCommit(String(data["data"]["download"]["url"]).split(".206")[1]).subscribe(blob => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(blob)
        a.href = objectUrl
        a.download = this.currentPath[this.currentPath.length - 1];
        a.click();
        URL.revokeObjectURL(objectUrl);
      });
    });
  }

  editFile(module: Module): void {

  }

  infoFile(module: Module): void {

  }

  deleteFile(module: Module): void {

  }

  createCommit( 
    content: PolymorpheusContent<TuiDialogContext>,
    header: PolymorpheusContent,
    size: TuiDialogSize): void
  {
    this.dialogSubscription = this.dialogs.open(
      content,
      {
        header,
        size,
      },
    ).subscribe();
  }

  commit() {

  }

  moveToParentDirectory(): void {
    if(this.modulesTree.length > 1) {
      const currentModule = this.modulesTree[this.modulesTree.length - 2];
      this.data = currentModule;
      this.modulesTree.pop();
    }
  }

  moveToChildDirectory(module: Module): void {
    if(module.type == "directory") {
      this.data = module;
      this.modulesTree[this.modulesTree.length] = { ...this.data };
    }
  }

  moveToDirectory(module: Module): void {
    let currentModule = this.modulesTree[this.modulesTree.length - 2];
    while (currentModule.name != module.name) {
      this.data = currentModule;
      this.modulesTree.pop();
      currentModule = this.modulesTree[this.modulesTree.length - 2];
    }
  }

  closeDialog() {
    this.dialogSubscription.unsubscribe();
  }

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles$.next(file as TuiFileLike);
  }

  removeFile(): void {
      this.fileValue.setValue(null);
  }

  clearRejected(): void {
      this.removeFile();
      this.rejectedFiles$.next(null);
  }

  makeRequest(file: TuiFileLike): Observable<TuiFileLike | null> {
      this.loadingFiles$.next(file);

      return timer(1000).pipe(
        map(() => { return file }),
        finalize(() => this.loadingFiles$.next(null)),
      );
  }

  readonly handler: TuiHandler<Module, readonly Module[]> = item => item.files || EMPTY_ARRAY;
}
