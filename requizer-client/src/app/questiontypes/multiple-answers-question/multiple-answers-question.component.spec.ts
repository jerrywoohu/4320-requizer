import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleAnswersQuestionComponent } from './multiple-answers-question.component';

describe('MultipleAnswersQuestionComponent', () => {
  let component: MultipleAnswersQuestionComponent;
  let fixture: ComponentFixture<MultipleAnswersQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleAnswersQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleAnswersQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
