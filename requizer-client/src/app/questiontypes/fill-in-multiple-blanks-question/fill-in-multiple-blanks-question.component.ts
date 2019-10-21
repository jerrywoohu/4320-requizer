import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-fill-in-multiple-blanks-question',
  templateUrl: './fill-in-multiple-blanks-question.component.html',
  styleUrls: ['./fill-in-multiple-blanks-question.component.scss']
})
export class FillInMultipleBlanksQuestionComponent implements OnInit {

  @Input() question: {
    answer: Array<string>,
    correct: boolean,
    question_id: string,
    question_text: any,
    score: number
  }

  @Output() score = new EventEmitter<number>()

  private responses: Array<string>

  constructor() {
    this.responses = []
  }

  ngOnInit() {
    for (let i = 0; i < this.responses.length; i++) {
      this.responses[i] = ""
    }
  }

  grade() {
    let points_received = 0
    for (let i = 0; i < this.question.answer.length; i++) {
      if (this.question.answer[i] == this.responses[i]) {
        points_received += (1 / this.question.answer.length)
      } else {
        points_received -= (1 / this.question.answer.length)
      }
    }
    points_received = (points_received >= 0) ? (Math.round(points_received * 100) / 100) : 0
    this.score.emit(points_received)
  }

}
