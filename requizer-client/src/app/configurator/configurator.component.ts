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

  private modules: Array<any>
  private submodules: Array<any>
  private selected_modules: Array<any>
  private catalog: Array<any>

  private quiz_questions: Array<any>
  private quiz_in_progress: boolean
  private results: Array<number>
  private show_results: boolean

  private options: {
    hide_incorrect: boolean,
    time_limit: number,
    total_questions: number,
    debug: {
      debug_panel_state: boolean,
      lookup: string,
      shuffle: boolean,
      show_ids: boolean,
      show_contributor: boolean
    }
  }

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    this.modules = []
    this.submodules = []
    this.catalog = []
    this.selected_modules = []
    this.quiz_in_progress = false;
    this.results = []
    this.show_results = false;

    this.options =  {
      hide_incorrect: true,
      time_limit: 0,
      total_questions: 0,
      debug: {
        debug_panel_state: false,
        lookup: '',
        shuffle: true,
        show_ids: false,
        show_contributor: false
      }
    }
  }

  ngOnInit() {
    this.updateConfig();
  }

  updateConfig() {
    let d = new Date()
    let d_ms = d.getTime()
    this.http.get('assets/config.json' + "?v=" + d_ms)
      .subscribe((data: {'modules': string, 'submodules': string, 'catalog': string}) => {
        
        this.http.get(data['submodules'] + "?v=" + d_ms)
          .subscribe((_submodules: Array<any>) => {
            // this.submodules = _submodules
          })

        this.http.get(data['catalog'] + "?v=" + d_ms)
          .subscribe((_catalog: Array<any>) => {
            this.catalog = _catalog
            for (let i = 0; i < this.catalog.length; i++) {
              this.catalog[i].handler.question_text = this.sanitizer.bypassSecurityTrustHtml(this.catalog[i].handler.question_text)
            }
          })

        this.http.get(data['modules'] + "?v=" + d_ms)
          .subscribe((_modules: Array<any>) => {
            this.modules = _modules
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
    for (let i = 0; i < this.selected_modules.length; i++) { // for each module
      
      let quiz_questions_to_push = []
      
      for (let j = 0; j < this.selected_modules[i].question_ids.length; j++) { // for each question in the module
        let found = this.catalog.find((question) => {
          return (question.id == this.selected_modules[i].question_ids[j])
        })

        if (found.handler.answer) { // drop all missing answers
          if (this.options.hide_incorrect && !found.handler.correct) {
            // if user wants to hide incorrect questions, and the question is incorrect
            // i know this branch is empty, it was just easier to code this way
          } else {
            quiz_questions_to_push.push(found)
          }
        }
      }

      quiz_questions_to_push = this.shuffleArray(quiz_questions_to_push)

      if (this.options.total_questions > 0) {
        if (this.options.total_questions < quiz_questions_to_push.length) {
          quiz_questions_to_push = quiz_questions_to_push.slice(0, this.options.total_questions)
        }
      }

      this.quiz_questions = this.quiz_questions.concat(quiz_questions_to_push)

    }

    if (this.quiz_questions.length > 0) {
      this.quiz_in_progress = true

      this.results = []
      for (let i = 0; i < this.quiz_questions.length; i++) {
        this.results[i] = 0
      }

      // console.log(this.quiz_questions)
    }
    window.scroll(0,0)
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}

  resetQuiz() {
    // location.reload();
    this.quiz_questions = []
    this.quiz_in_progress = false
    this.show_results = false
    this.selected_modules = []
    window.scroll(0,0)
  }

  onSelection(e, v) {
    this.selected_modules = v.map((a) => {
      // return just the values
      return a.value
    })
  }

  recordResult($event: number, i) {
    this.results[i] = $event
  }

  printQuestion(_input) {
    return JSON.stringify(_input)
  }

  showResults() {
    this.show_results = true
    window.scroll(0,0)
  }

  calculateScore() {
    let current_score = 0;
    for (let i = 0; i < this.results.length; i++) {
      current_score += this.results[i]
    }

    return Math.round((current_score / this.results.length) * 10000) / 100
  }
  
  getCompleteQuizzes(_quizzes) {
    return _quizzes.filter(a => a.identification)
  }

}
