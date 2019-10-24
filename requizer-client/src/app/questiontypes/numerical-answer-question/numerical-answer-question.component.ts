import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-numerical-answer-question',
  templateUrl: './numerical-answer-question.component.html',
  styleUrls: ['../questiontypes.scss', './numerical-answer-question.component.scss']
})
export class NumericalAnswerQuestionComponent implements OnInit {

  @Input() question: {
    answer: number,
    correct: boolean,
    question_id: string,
    question_text: any,
    score: number,
    delta: number
  }

  @Output() score = new EventEmitter<number>()

  private response: number

  constructor() { }

  ngOnInit() {
  }

  grade() {
    if (Math.abs(this.response - this.question.answer) <= this.question.delta) {
      this.score.emit(1.0)
    } else {
      this.score.emit(0.0)
    }
  }


}
