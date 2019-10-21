import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-multiple-choice-question',
  templateUrl: './multiple-choice-question.component.html',
  styleUrls: ['./multiple-choice-question.component.scss']
})
export class MultipleChoiceQuestionComponent implements OnInit {

  @Input() question: {
    answer: string,
    correct: boolean,
    options: Array<string>,
    question_id: string,
    question_text: any,
    score: number
  }

  @Output() score = new EventEmitter<number>()

  private selected_answer: string

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