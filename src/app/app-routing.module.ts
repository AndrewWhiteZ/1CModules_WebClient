import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RepositoriesComponent } from './repositories/repositories.component';
import { SnippetsComponent } from './snippets/snippets.component';
import { RepoPresentationComponent } from './repo-presentation/repo-presentation.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'repositories', component: RepositoriesComponent },
  { path: 'snippets', component: SnippetsComponent },
  { path: 'repositories/:repo_id', component: RepoPresentationComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
