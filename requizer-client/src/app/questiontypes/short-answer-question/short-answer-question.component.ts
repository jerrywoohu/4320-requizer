import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-short-answer-question',
  templateUrl: './short-answer-question.component.html',
  styleUrls: ['../questiontypes.scss', '../questiontypes.scss', './short-answer-question.component.scss']
})
export class ShortAnswerQuestionComponent implements OnInit {

  @Input() question: {
    answer: string,
    correct: boolean,
    question_id: string,
    question_text: any,
    score: number
  };

  @Output() score = new EventEmitter<number>()

  private response: string

  constructor() { }

  ngOnInit() {
  }

  grade() {
    if (this.response.toUpperCase() == this.question.answer.toUpperCase()) {
      this.score.emit(1.0)
    } else {
      this.score.emit(0.0)
    }
  }

}
