import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RepositoriesComponent } from './repositories/repositories.component';
import { SnippetsComponent } from './snippets/snippets.component';
import { RepoPresentationComponent } from './repo-presentation/repo-presentation.component';
import { ProfileComponent } from './profile/profile.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { RepoEditComponent } from './repo-edit/repo-edit.component';

const routes: Routes = [
  { path: 'home', title: '1CModules - Главная', component: HomeComponent },
  { path: 'repositories', title: '1CModules - Репозитории', component: RepositoriesComponent },
  { path: 'snippets', title: '1CModules - Отрывки', component: SnippetsComponent },
  { path: 'profile/me', title: '1CModules - Мой профиль', component: MyProfileComponent },
  { path: 'profile/:user_id', title: '1CModules - Профиль', component: ProfileComponent },
  { path: 'repositories/:repo_id/edit', title: '1CModules - Изменение', component: RepoEditComponent },
  { path: 'repositories/:repo_id', title: '1CModules - Репозиторий', component: RepoPresentationComponent },
  { path: '**', title: '1CModules - Главная', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
