import { ChangeDetectorRef, ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { RepoRequestService } from '../repo-request.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Module } from '../Module';
import { EMPTY_ARRAY, TuiHandler } from '@taiga-ui/cdk';
import { TuiAlertService, TuiDialogService, TuiNotification, TuiDialogContext, TuiDialogSize } from '@taiga-ui/core';
import { PolymorpheusComponent, PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { CommitShort } from '../CommitShort';
import { Commit } from '../Commit';
import { TUI_PROMPT, TuiPromptData } from '@taiga-ui/kit';
import { Subscription, Observable, of, Subject, timer } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { TuiFileLike } from '@taiga-ui/kit';
import { TUI_TREE_CONTENT } from '@taiga-ui/kit';
import { FoldersComponent } from './folders/folders.component';

// interface TreeNode {
//   readonly children: readonly TreeNode[];
//   readonly text: string;
// }

@Component({
  selector: 'app-repo-presentation',
  templateUrl: './repo-presentation.component.html',
  styleUrls: ['./repo-presentation.component.less'],
  providers: [
    {
      provide: TUI_TREE_CONTENT,
      useValue: new PolymorpheusComponent(FoldersComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepoPresentationComponent {

  radius: number = 15;
  skeletonVisible: boolean = true;
  skeletonCommitVisible: boolean = true;

  activeStepperItem: number = 0;
  dialogSubscription: Subscription = new Subscription;
  activeOutputFormat: number = 0;
  maxBreadcrumbElements: number = 2;
  repoId: string = '';
  path: string = '';
  currentPath: string[] = [];
  currentModule: Module | null = null;
  currentCommit: Commit | null = null;
  modulesList: Array<Module> = [
    new Module('___name___', '__type__', new CommitShort('__id__', '__message__', new Date()), false, null),
    new Module('____name____', '__type__', new CommitShort('__id__', '__message__', new Date()), false, null),
    new Module('______name______', '__type__', new CommitShort('__id__', '__message__', new Date()), false, null),
    new Module('____name____', '__type__', new CommitShort('__id__', '__message__', new Date()), false, null),
    new Module('_____name_____', '__type__', new CommitShort('__id__', '__message__', new Date()), false, null)
  ];
  commitsList: Array<Commit> = [];

  moduleList: Module[] = [];
  commitList: Commit[] = [];

  fileSearchForm = new FormGroup({
    fileSearchValue: new FormControl("", Validators.nullValidator),
  });

  commitSearchForm = new FormGroup({
    commitSearchValue: new FormControl("", Validators.nullValidator),
  });

  commitForm = new FormGroup({
    isNewFile: new FormControl(true, Validators.required),
    fileValue: new FormControl(),
    filenameValue: new FormControl(``, Validators.required),
    descriptionValue: new FormControl(``),
    commitMessageValue: new FormControl(``, Validators.required),
    commitTagsValue: new FormControl(``),
    pathValue: new FormControl(``),
  });

  editModuleForm = new FormGroup({
    descriptionValue: new FormControl(``, Validators.required),
    tagsValue: new FormControl(``, Validators.required),
  });
  
  editCommitForm = new FormGroup({
    tagsValue: new FormControl(``, Validators.required),
  });

  file: TuiFileLike = {
    name: '',
  }

  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$ = this.commitForm.controls.fileValue.valueChanges.pipe(
    switchMap(file => { this.file = file; return (file ? this.makeRequest(file) : of(null)) }),
  );

  module: Module = {
    name: '...',
    type: 'directory',
    lastCommit: new CommitShort('_1', 'root_commit', new Date()),
    locked: false,
    files: this.modulesList,
  }

  modalModule: Module = {
    name: '...',
    type: 'directory',
    lastCommit: new CommitShort('_1', 'root_commit', new Date()),
    locked: false,
    files: this.modulesList,
  }

  modulesTree: Module[] = [this.module];
  modalModulesTree: Module[] = [this.modalModule];

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
    if(module.type == 'file') {
      this.currentModule = module;
      this.showCommits();
    }
  }

  openTreeNode(module: Module) {
    this.currentPath = [module.name];
    if(module.type == 'file') {
      this.currentModule = module;
      this.showCommits();
    }
  }

  filenameChangeHandler() {
    this.commitForm.patchValue({ pathValue: this.commitForm.controls.filenameValue.value });
  }

  showModules() {
    this.repoRequestService.getModulesByRepoId(this.repoId).subscribe((data: Module[]) => { 
      this.module.files = data;
      this.modulesTree[0] = { ...this.module };
      this.modalModule.files = data;
      this.modalModulesTree[0] = { ...this.modalModule };
      this.currentCommit = null;
      this.skeletonVisible = false;
      this.cdr.detectChanges();
    }), (error: any) => {
      error = error["error"];
      this.alerts.open(error["message"], {
        label: 'Ошибка', 
        status: TuiNotification.Error, 
        autoClose: false
      }).subscribe();
      this.cdr.detectChanges();
    };
  }

  showCommits() {
    this.skeletonCommitVisible = true;
    const pathToModule = this.modulesTree.map(a => a.name).slice(1).join('/');
    this.repoRequestService.getCommitsByRepoModule(this.repoId, pathToModule + '/' + this.currentModule?.name).subscribe((data: Commit[]) => {
      this.commitsList = data;
      this.skeletonCommitVisible = false;
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

  lockFile(event: MouseEvent, module: Module): void {
    event.stopPropagation();
    const pathToModule = this.modulesTree.map(a => a.name).slice(1).join('/');

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
        this.repoRequestService.lockModule(this.repoId, pathToModule + '/' + this.currentModule?.name).subscribe(data => {
          module.locked = true;
          this.cdr.detectChanges();
          this.alerts.open(`Файл <b>${module.name}</b> успешно захвачен`, { 
            label: 'Захвачен', 
            status: TuiNotification.Success, 
            autoClose: false
          }).subscribe();      
        });
      }
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

  unlockFile(event: MouseEvent, module: Module): void {
    event.stopPropagation();
    const pathToModule = this.modulesTree.map(a => a.name).slice(1).join('/');

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
        this.repoRequestService.unlockModule(this.repoId, pathToModule + '/' + this.currentModule?.name).subscribe(data => {
          module.locked = false;
          this.cdr.detectChanges();
          this.alerts.open(`Захват с файла <b>${module.name}</b> успешно снят`, { 
            label: 'Захват снят', 
            status: TuiNotification.Success, 
            autoClose: false
           }).subscribe();
        });
      }
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

  downloadLastCommit(event: MouseEvent, module: Module): void {
    event.stopPropagation();
    const pathToModule = this.modulesTree.map(a => a.name).slice(1).join('/');
    this.repoRequestService.getModuleLastCommitInfo(this.repoId, pathToModule + '/' + this.currentModule?.name).subscribe((data: any) => {
      this.repoRequestService.downloadCommit(String(data["data"]["download"]["url"]).split(".206")[1]).subscribe(blob => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(blob)
        a.href = objectUrl
        a.download = module.name;
        a.click();
        URL.revokeObjectURL(objectUrl);
      });
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

  downloadCommit(event: MouseEvent, commit: Commit): void {
    event.stopPropagation();
    
    const pathToModule = this.modulesTree.map(a => a.name).slice(1).join('/');
    this.repoRequestService.getModuleCommitInfo(this.repoId, pathToModule + '/' + this.currentModule?.name, commit.id).subscribe((data: any) => {
      this.repoRequestService.downloadCommit(String(data["data"]["download"]["url"]).split(".206")[1]).subscribe(blob => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(blob)
        a.href = objectUrl
        a.download = this.currentPath[this.currentPath.length - 1];
        a.click();
        URL.revokeObjectURL(objectUrl);
      });
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

  editFile(): void {
    const pathToModule = this.modulesTree.map(a => a.name).slice(1).join('/');
    this.repoRequestService.patchModule(this.repoId, pathToModule + '/' + this.currentModule?.name, { 
      "description": this.editModuleForm.controls.descriptionValue.value,
      "tags": this.editModuleForm.controls.tagsValue.value,
    }).subscribe((data: any) => {
      if(data["status"] == 0) {
        this.alerts.open(`Файл успешно изменён`, {
          label: 'Изменен', 
          status: TuiNotification.Success, 
          autoClose: false
        }).subscribe();
        this.modulesList = data["data"];
        this.editModuleForm.reset();
        this.dialogSubscription.unsubscribe();
        this.cdr.detectChanges();
      } else {
        this.alerts.open(data["message"], {
          label: 'Ошибка', 
          status: TuiNotification.Error, 
          autoClose: false
        }).subscribe();
        this.cdr.detectChanges();
      }
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

  editCommit(): void {
    this.repoRequestService.patchCommit(this.repoId, this.currentCommit!.id, { 
      "tags": this.editCommitForm.controls.tagsValue.value,
    }).subscribe((data: any) => {
      if(data["status"] == 0) {
        this.alerts.open(`Коммит успешно изменён`, {
          label: 'Изменен', 
          status: TuiNotification.Success, 
          autoClose: false
        }).subscribe();
        this.currentCommit = data["data"];
        this.editCommitForm.reset();
        this.dialogSubscription.unsubscribe();
        this.cdr.detectChanges();
      } else {
        this.alerts.open(data["message"], {
          label: 'Ошибка', 
          status: TuiNotification.Error, 
          autoClose: false
        }).subscribe();
        this.cdr.detectChanges();
      }
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

  deleteFile(module: Module): void {
    const data: TuiPromptData = {
      content: `Вы действительно хотите удалить файл <b>${module.name}</b> из репозитория?`,
      yes: 'Да, удалить файл',
      no: 'Отмена',
    };

    const pathToModule = this.modulesTree.map(a => a.name).slice(1).join('/');
    this.dialogs.open<boolean>(TUI_PROMPT, {
      label: "",
      size: "m",
      data,
    })
    .subscribe(response => {
      if(response) {
        this.repoRequestService.deleteModule(this.repoId, pathToModule + '/' + this.currentModule?.name).subscribe((data: any) => {
          if(data["status"] == 0) {
            this.alerts.open(`Файл <b>${module.name}</b> успешно удален из репозитория`, { 
              label: 'Удален',
              status: TuiNotification.Success, 
              autoClose: false
            }).subscribe();
            this.showModules();
            this.dialogSubscription.unsubscribe();
            this.cdr.detectChanges();
          } else {
            this.alerts.open(`${data["message"]}`, { 
              label: 'Ошибка', 
              status: TuiNotification.Error, 
              autoClose: false
            }).subscribe();
          }
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
    });
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

  commitRequest() {
    const formData: FormData = new FormData();

    if (this.moduleList.length > 1) {
      
    }

    const correctedPath = this.commitForm.controls.pathValue.value;

    const fullfilledPath = correctedPath + "/" + this.commitForm.controls.filenameValue.value;

    const filePath = this.commitForm.controls.fileValue.value.name;
    let newPath = "";

    console.log(fullfilledPath);
    console.log(filePath);

    if (fullfilledPath?.indexOf(".") !== undefined) {
      let filePathPieces = filePath!.split(".");
      let extension = filePathPieces.reverse()[0];

      console.log(filePathPieces);

      let fullfilledPathExt = fullfilledPath!.split(".").reverse()[0];

      newPath = fullfilledPathExt !== undefined ? fullfilledPath + "." + extension : fullfilledPath;
    }

    console.log(newPath);

    formData.append("path", newPath);
    formData.append("message", this.commitForm.controls.commitMessageValue.value ? this.commitForm.controls.commitMessageValue.value : '');
    formData.append("fileDescription", this.commitForm.controls.descriptionValue.value ? this.commitForm.controls.descriptionValue.value : '');
    formData.append("fileTags", '');
    formData.append("commitTags", this.commitForm.controls.commitTagsValue.value ? this.commitForm.controls.commitTagsValue.value : '');
    formData.append("file", this.commitForm.controls.fileValue.value ? this.commitForm.controls.fileValue.value : '');

    this.repoRequestService.createCommit(this.repoId, formData).subscribe((data: any) => {
      if(data["status"] == 0) {
        this.alerts.open(`Файл <b>${data["data"]["message"]}</b> успешно загружен`, {
          label: 'Загружен', 
          status: TuiNotification.Success, 
          autoClose: false
        }).subscribe();
        this.dialogSubscription.unsubscribe();
        this.showModules();
        this.commitForm.reset();
        this.cdr.detectChanges();
      } else {
        this.alerts.open(data["message"], {
          label: 'Ошибка', 
          status: TuiNotification.Error, 
          autoClose: false
        }).subscribe();
        this.cdr.detectChanges();
      };
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

  moveToParentDirectory(): void {
    if(this.modulesTree.length > 1) {
      const currentModule = this.modulesTree[this.modulesTree.length - 2];
      this.module = currentModule;
      this.modulesTree.pop();
    }
  }

  moveToChildDirectory(module: Module): void {
    if(module.type == "directory") {
      this.module = module;
      this.modulesTree[this.modulesTree.length] = { ...this.module };
    }
  }

  moveToDirectory(module: Module): void {
    let currentModule = this.modulesTree[this.modulesTree.length - 2];
    while (currentModule.name != module.name) {
      this.module = currentModule;
      this.modulesTree.pop();
      currentModule = this.modulesTree[this.modulesTree.length - 2];
    }
  }

  modalMoveToParentDirectory(): void {
    if(this.modalModulesTree.length > 1) {
      const currentModule = this.modalModulesTree[this.modalModulesTree.length - 2];
      this.modalModule = currentModule;
      this.modalModulesTree.pop();
    }
  }

  modalMoveToChildDirectory(module: Module): void {
    if(module.type == "directory") {
      this.modalModule = module;
      this.modalModulesTree[this.modalModulesTree.length] = { ...this.modalModule };
    }
  }

  modalSetCurrentModulePath(module: Module): void {
    if(module.type == "file") {
      const pathToModule = this.modalModulesTree.map(a => a.name).slice(1).concat(module.name).join('/');
      this.commitForm.controls.pathValue.setValue(pathToModule);
    }
  }

  closeDialog() {
    this.dialogSubscription.unsubscribe();
  }

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles$.next(file as TuiFileLike);
  }

  removeFile(): void {
      this.commitForm.controls.fileValue.setValue(null);
  }

  clearRejected(): void {
      this.removeFile();
      this.rejectedFiles$.next(null);
  }

  makeRequest(file: TuiFileLike): Observable<TuiFileLike | null> {
      this.loadingFiles$.next(file);

      return timer(1).pipe(
        map(() => {
          return file;
        }),
      finalize(() => this.loadingFiles$.next(null)),
    );
  }

  openEditModuleDialog(
    content: PolymorpheusContent<TuiDialogContext>,
    size: TuiDialogSize): void
  {
    this.dialogSubscription = this.dialogs.open(
      content,
      {
        label: 'Изменение файла',
        size,
      },
    ).subscribe();
  }

  openEditCommitDialog(
    content: PolymorpheusContent<TuiDialogContext>,
    size: TuiDialogSize,
    commit: Commit): void
  {
    this.dialogSubscription = this.dialogs.open(
      content,
      {
        data: commit,
        label: 'Изменение коммита',
        size,
      },
    ).subscribe();
  }

  searchModules() {
    if(this.fileSearchForm.controls.fileSearchValue.value!.length > 0) {
      this.repoRequestService.repoModuleSearch(this.repoId, { 'tags': this.fileSearchForm.controls.fileSearchValue.value }).subscribe((data: any) => {
        this.modulesList = data["data"]["results"];
        this.cdr.detectChanges();
      });
    }
  }

  searchCommits() {
    if(this.commitSearchForm.controls.commitSearchValue.value!.length > 0) {
      this.repoRequestService.repoCommitSearch(this.repoId, { 'tags': this.commitSearchForm.controls.commitSearchValue.value }).subscribe((data: any) => {
        this.commitsList = data["data"]["results"];
        this.cdr.detectChanges();
      });
    }
  }

  readonly handler: TuiHandler<Module, readonly Module[]> = item => item.files || EMPTY_ARRAY;
}
