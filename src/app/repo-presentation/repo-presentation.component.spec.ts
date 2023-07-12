import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoPresentationComponent } from './repo-presentation.component';

describe('RepoPresentationComponent', () => {
  let component: RepoPresentationComponent;
  let fixture: ComponentFixture<RepoPresentationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RepoPresentationComponent]
    });
    fixture = TestBed.createComponent(RepoPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
