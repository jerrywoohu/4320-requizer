import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-multiple-answers-question',
  templateUrl: './multiple-answers-question.component.html',
  styleUrls: ['./multiple-answers-question.component.scss']
})
export class MultipleAnswersQuestionComponent implements OnInit {

  @Input() question: {
    answer: Array<string>,
    correct: boolean,
    options: Array<string>,
    question_id: string,
    question_text: any,
    score: number
  };

  @Output() score = new EventEmitter<number>()

  private selected_answers: Array<boolean>

  constructor() { 
    this.selected_answers = []
  }

  ngOnInit() {
    for (let i = 0; i < this.question.options.length ; i++) {
      this.selected_answers[i] = false
    }
  }

  grade() {
    let points_received = 0
    for (let i = 0; i < this.selected_answers.length; i++) {

      if (this.selected_answers[i]) {
        if (this.question.answer.includes(this.question.options[i])) {
          points_received += (1 / this.question.answer.length)
        } else {
          points_received -= (1 / this.question.answer.length)
        }
      }

    }
    points_received = (points_received >= 0) ? (Math.round(points_received * 100) / 100) : 0
    this.score.emit(points_received)
  }

}
