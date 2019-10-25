import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss']
})
export class LearnComponent implements OnInit {

  @Input() selected_modules: Array<any>
  @Input() options: {
    hide_incorrect: boolean,
    number_of_questions: number,
    shuffle: boolean
  }
  @Output() quiz_done: EventEmitter<number>

  private results: Array<number>
  private show_results: boolean
  private catalog: Array<any>
  private quiz_questions: Array<any>

  private dev_options: {
    lookup: string,
    show_ids: boolean,
    show_contributor: boolean,
    terminal_output: string
  }

  constructor() {
    this.quiz_done = new EventEmitter<number>()

    this.catalog = []
    this.results = []
    this.show_results = false
    this.quiz_questions = [];
    this.dev_options = {
      lookup: '',
      show_ids: false,
      show_contributor: false,
      terminal_output: ""
    }
  }

  ngOnInit() {
  }

}
