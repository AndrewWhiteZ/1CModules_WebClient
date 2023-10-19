import { Component } from '@angular/core';
import { TuiTreeItemContentComponent } from '@taiga-ui/kit';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.less'],
  host: {
    '(click)': 'onClick()',
  }
})
export class FoldersComponent extends TuiTreeItemContentComponent {
  get icon(): string {
    return this.isExpandable ? 'tuiIconFolderLarge' : 'tuiIconFileLarge';
  }
}
