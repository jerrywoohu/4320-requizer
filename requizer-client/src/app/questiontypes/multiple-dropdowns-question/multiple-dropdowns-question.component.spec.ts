import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleDropdownsQuestionComponent } from './multiple-dropdowns-question.component';

describe('MultipleDropdownsQuestionComponent', () => {
  let component: MultipleDropdownsQuestionComponent;
  let fixture: ComponentFixture<MultipleDropdownsQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleDropdownsQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleDropdownsQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
