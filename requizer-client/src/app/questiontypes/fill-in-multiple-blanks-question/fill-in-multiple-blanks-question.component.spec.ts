import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FillInMultipleBlanksQuestionComponent } from './fill-in-multiple-blanks-question.component';

describe('FillInMultipleBlanksQuestionComponent', () => {
  let component: FillInMultipleBlanksQuestionComponent;
  let fixture: ComponentFixture<FillInMultipleBlanksQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillInMultipleBlanksQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FillInMultipleBlanksQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
