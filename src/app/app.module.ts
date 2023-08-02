import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { TuiRootModule, TuiDialogModule, TuiAlertModule, TuiSvgModule, TuiButtonModule, TuiTextfieldControllerModule, TuiHostedDropdownModule, TuiDataListModule, TUI_SANITIZER } from "@taiga-ui/core";
import { TuiInputModule, TuiAccordionModule, TuiElasticContainerModule, TuiIslandModule, TuiActionModule, TuiTabsModule, TuiTagModule, TuiTilesModule, TuiTreeModule, TuiAvatarModule, TuiBreadcrumbsModule, TuiLineClampModule, TuiMarkerIconModule, TuiInputPasswordModule, TuiPromptModule, TuiStepperModule, TuiInputFilesModule, TuiInputTagModule, TuiTextAreaModule } from "@taiga-ui/kit";
import { TuiTableModule, TuiReorderModule } from "@taiga-ui/addon-table"
import { FormsModule } from '@angular/forms';
import { TuiLetModule } from '@taiga-ui/cdk';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RepositoriesComponent } from './repositories/repositories.component';
import { SnippetsComponent } from './snippets/snippets.component';
import { RepoPresentationComponent } from './repo-presentation/repo-presentation.component';
import { HttpClientModule } from '@angular/common/http';
import { ModalComponent } from './modal/modal.component';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularSplitModule } from 'angular-split';
import { ProfileComponent } from './profile/profile.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { RepoEditComponent } from './repo-edit/repo-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RepositoriesComponent,
    SnippetsComponent,
    RepoPresentationComponent,
    ModalComponent,
    ProfileComponent,
    MyProfileComponent,
    RepoEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AngularSplitModule,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiSvgModule,
    TuiButtonModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiAccordionModule,
    TuiElasticContainerModule,
    TuiIslandModule,
    TuiActionModule,
    TuiTabsModule,
    TuiTagModule,
    TuiTilesModule,
    TuiTableModule,
    TuiTreeModule,
    TuiAvatarModule,
    TuiBreadcrumbsModule,
    TuiLetModule,
    TuiLineClampModule,
    TuiMarkerIconModule,
    TuiReorderModule,
    TuiHostedDropdownModule,
    TuiInputPasswordModule,
    FormsModule,
    TuiPromptModule,
    TuiStepperModule,
    TuiInputFilesModule,
    TuiInputTagModule,
    TuiDataListModule,
    TuiTextAreaModule,
],
  providers: [{provide: TUI_SANITIZER, useClass: NgDompurifySanitizer}],
  bootstrap: [AppComponent]
})
export class AppModule { }
