import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import { MultipleChoiceQuestionComponent } from '../questiontypes/multiple-choice-question/multiple-choice-question.component'
import { ShortAnswerQuestionComponent } from '../questiontypes/short-answer-question/short-answer-question.component'
import { MultipleAnswersQuestionComponent } from '../questiontypes/multiple-answers-question/multiple-answers-question.component'
import { MatchingQuestionComponent } from '../questiontypes/matching-question/matching-question.component'
import { FillInMultipleBlanksQuestionComponent } from '../questiontypes/fill-in-multiple-blanks-question/fill-in-multiple-blanks-question.component'
import { MultipleDropdownsQuestionComponent } from '../questiontypes/multiple-dropdowns-question/multiple-dropdowns-question.component'
import { NumericalAnswerQuestionComponent } from '../questiontypes/numerical-answer-question/numerical-answer-question.component'
import { TrueFalseQuestionComponent } from '../questiontypes/true-false-question/true-false-question.component'

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.scss']
})
export class ConfiguratorComponent implements OnInit {

  private modules: Array<any>;
  private config: {'modules': string, 'catalog': string};
  private selected_modules: Array<any>;
  private catalog: Array<any>;

  private quiz_questions: Array<any>;
  private quiz_in_progress: boolean;
  private results: Array<number>
  private show_results: boolean

  private options: {
    hide_incorrect: boolean,
    time_limit: number,
    total_questions: number,
    lookup: string
  }

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    this.modules = []
    this.catalog = []
    this.selected_modules = []
    this.quiz_in_progress = false;
    this.results = []
    this.show_results = false;

    this.options =  {
      hide_incorrect: true,
      time_limit: 0,
      total_questions: 0,
      lookup: ""
    }
  }

  ngOnInit() {
    this.updateConfig();
  }

  updateConfig() {
    this.http.get('assets/config.json')
      .subscribe((data) => {
        this.config = {
          'modules': data['modules'],
          'catalog':  data['catalog']
        }
        
        this.http.get(this.config['modules'])
          .subscribe((_modules: Array<any>) => {
            this.modules = _modules
          })

        this.http.get(this.config['catalog'])
          .subscribe((_catalog: Array<any>) => {
            this.catalog = _catalog
          })
      })
  }

  lookupQuestion(_id) {
    console.log(this.catalog.find((question) => {
      return (question.id == _id)
    }))
  }

  generateQuiz() {
    this.quiz_questions = []
    for (let i = 0; i < this.selected_modules.length; i++) {
      for (let j = 0; j < this.selected_modules[i].question_ids.length; j++) {
        let found = this.catalog.find((question) => {
          return (question.id == this.selected_modules[i].question_ids[j])
        })

        found.handler.question_text = this.sanitizer.bypassSecurityTrustHtml(found.handler.question_text)
        if (found.handler.answer) { // drop all missing answers
          if (this.options.hide_incorrect && !found.handler.correct) {
            // if user wants to hide incorrect questions, and the question is incorrect
            // i know this branch is empty, it was just easier to code this way
          } else {
            this.quiz_questions.push(found)
          }
        }
      }
    }
    if (this.quiz_questions.length > 0) {
      this.quiz_in_progress = true

      this.results = []
      for (let i = 0; i < this.quiz_questions.length; i++) {
        this.results[i] = 0
      }

      console.log(this.quiz_questions)
    }
    window.scroll(0,0);
  }

  resetQuiz() {
    this.quiz_questions = [];
    this.quiz_in_progress = false;
    this.show_results = false;
    window.scroll(0,0);
  }

  onSelection(e, v) {
    this.selected_modules = v.map((a) => {
      // return just the values
      return a.value
    })
  }

  recordResult($event: number, i) {
    this.results[i] = $event

    let current_score = 0;
    for (let i = 0; i < this.results.length; i++) {
      current_score += this.results[i]
    }

    console.log(Math.round((current_score / this.results.length) * 100) / 100)
  }

  printQuestion(_input) {
    return JSON.stringify(_input)
  }

  showResults() {
    this.show_results = true;
    window.scroll(0,0);
  }

}
