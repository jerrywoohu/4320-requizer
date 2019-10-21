import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-matching-question',
  templateUrl: './matching-question.component.html',
  styleUrls: ['./matching-question.component.scss']
})
export class MatchingQuestionComponent implements OnInit {

  @Input() question: {
    answer: Array<{prompt: string, answer: string}>,
    prompts: Array<string>,
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
    for (let i = 0; i < this.question.prompts.length; i++) {
      this.responses[i] = ""
    }
  }

  shuffleArray(array) {
    // todo: shuffle array
    return array
  }

  grade() {
    let points_received = 0
    for (let i = 0; i < this.responses.length; i++) {
      if (this.question.answer[i].answer == this.responses[i]) {
        points_received += (1 / this.question.prompts.length)
      } else {
        // possibly wrong
        points_received -= (1 / this.question.prompts.length)
      }
    }
    points_received = (points_received >= 0) ? (Math.round(points_received * 100) / 100) : 0
    this.score.emit(points_received)
  }

}
