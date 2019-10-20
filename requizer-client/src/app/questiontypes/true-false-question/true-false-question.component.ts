import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-true-false-question',
  templateUrl: './true-false-question.component.html',
  styleUrls: ['./true-false-question.component.scss']
})
export class TrueFalseQuestionComponent implements OnInit {

  @Input() question: {
    answer: string,
    correct: boolean,
    options: Array<string>
    question_id: string,
    question_text: any,
    score: number
  }

  @Output() score = new EventEmitter<number>()

  selected_answer: string

  constructor() { }

  ngOnInit() {
  }

  grade() {
    if (this.selected_answer.toUpperCase() == this.question.answer.toUpperCase()) {
      this.score.emit(1.0)
    } else {
      this.score.emit(0.0)
    }
  }

}
