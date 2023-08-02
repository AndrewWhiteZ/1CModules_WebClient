import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoEditComponent } from './repo-edit.component';

describe('RepoEditComponent', () => {
  let component: RepoEditComponent;
  let fixture: ComponentFixture<RepoEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RepoEditComponent]
    });
    fixture = TestBed.createComponent(RepoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
