import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RepoRequestService } from '../repo-request.service';
import { Module } from '../Module';
import {EMPTY_ARRAY, TuiHandler} from '@taiga-ui/cdk';
import {TUI_TREE_CONTENT} from '@taiga-ui/kit';

interface TreeNode {
  readonly text: string;
  readonly children?: readonly TreeNode[];
}

@Component({
  selector: 'app-repo-presentation',
  templateUrl: './repo-presentation.component.html',
  styleUrls: ['./repo-presentation.component.scss']
})
export class RepoPresentationComponent {

  activeOutputFormat: number = 0;
  repoId: string = '';
  modulesList: Array<Module> = [];

  readonly data: TreeNode = {
    text: 'Topmost',
    children: [
        {
            text: 'Top level 1',
            children: [
                {
                    text: 'Another item',
                    children: [
                        {text: 'Next level 1'},
                        {text: 'Next level 2'},
                        {text: 'Next level 3'},
                    ],
                },
            ],
        },
        {text: 'Top level 2'},
        {
            text: 'Top level 3',
            children: [{text: 'Test 1'}, {text: 'Test 2'}],
        },
    ],
};

  constructor(private router: Router, private repoRequestService: RepoRequestService) {}

  ngOnInit() {
    this.repoId = this.router.url.split("/").pop()!;
    this.showModules();
  }

  showModules() {
    this.repoRequestService.getModulesByRepoId(this.repoId).subscribe({next:(data: Module[]) => { this.modulesList = data; }});
  }

  readonly handler: TuiHandler<TreeNode, readonly TreeNode[]> = item =>
        item.children || EMPTY_ARRAY;

}
