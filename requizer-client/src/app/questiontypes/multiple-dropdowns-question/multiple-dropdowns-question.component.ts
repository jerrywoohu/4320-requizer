import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-multiple-dropdowns-question',
  templateUrl: './multiple-dropdowns-question.component.html',
  styleUrls: ['../questiontypes.scss', './multiple-dropdowns-question.component.scss']
})
export class MultipleDropdownsQuestionComponent implements OnInit {

  @Input() question: {
    answer: string,
    correct: boolean,
    options: Array<string>,
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
    for (let i = 0; i < this.question.answer.length; i++) {
      this.responses[i] = ""
    }
  }

  shuffleArray(array) {
    // incomplete
    return array
  }

  returnSlice(array: Array<any>, start: number, end: number) {
    return array.slice(start, end)
  }

  grade() {
    let points_received = 0
    // console.log(this.responses)
    for (let i = 0; i < this.responses.length; i++) {
      if (this.responses[i] != "") {
        if (this.question.answer[i] == this.responses[i]) {
          points_received += (1 / this.question.answer.length)
        } else {
          points_received -= (1 / this.question.answer.length)
        }
      }
    }
    points_received = (points_received >= 0) ? points_received : 0
    this.score.emit(Math.round(points_received * 100) / 100)
  }

}
