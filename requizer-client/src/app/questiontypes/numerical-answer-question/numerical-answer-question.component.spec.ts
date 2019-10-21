import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericalAnswerQuestionComponent } from './numerical-answer-question.component';

describe('NumericalAnswerQuestionComponent', () => {
  let component: NumericalAnswerQuestionComponent;
  let fixture: ComponentFixture<NumericalAnswerQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumericalAnswerQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumericalAnswerQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
