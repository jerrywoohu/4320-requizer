import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

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

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
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
    this.updateConfig().then(() => {
      this.generateQuiz()
    })
  }

  updateConfig(): Promise<any> {
    return new Promise((resolve, reject) => {
      let d = new Date()
      let d_ms = d.getTime()
      this.http.get('assets/config.json' + "?v=" + d_ms)
        .subscribe((data: {'modules': string, 'submodules': string, 'catalog': string}) => {

          this.http.get(data['catalog'] + "?v=" + d_ms)
            .subscribe((_catalog: Array<any>) => {
              this.catalog = _catalog
              for (let i = 0; i < this.catalog.length; i++) {
                this.catalog[i].handler.question_text = this.sanitizer.bypassSecurityTrustHtml(this.catalog[i].handler.question_text)
              }
              resolve()
            }, (error) => {
              reject(error)
            })

        }, (error) => {
          reject(error)
        })
    })
  }

  generateQuiz() {
    if (this.selected_modules.length > 0) {
      this.quiz_questions = []
      // console.log(this.selected_modules)
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

        if (this.options.shuffle) quiz_questions_to_push = this.shuffleArray(quiz_questions_to_push)

        if (this.options.number_of_questions > 0) {
          if (this.options.number_of_questions < quiz_questions_to_push.length) {
            quiz_questions_to_push = quiz_questions_to_push.slice(0, this.options.number_of_questions)
          }
        }

        this.quiz_questions = this.quiz_questions.concat(quiz_questions_to_push)

      }

      this.results = []
      for (let i = 0; i < this.quiz_questions.length; i++) {
        this.results[i] = 0
      }

    } else {
      console.log('this app-quiz component started without any modules')
    }
  }

  /**
   * 
   * @param array anything
   */
  shuffleArray(_array: Array<any>): Array<any> {
    for (let i = _array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temp = _array[i]
        _array[i] = _array[j]
        _array[j] = temp
    }
    return _array
  }

  /**
   * Find question in database by id
   * @param _id number
   */
  lookupQuestion(_id) {
    this.dev_options.terminal_output = JSON.stringify(this.catalog.find((question) => {
      return question.id == _id
    }), undefined, 2)
    return -1
  }

  /**
   * Leaves quiz
   */
  resetQuiz() {
    this.quiz_done.emit(this.calculateScore())
  }

  /**
   * Updates the score array
   * @param $event ?
   * @param i index of question in this.quiz_questions
   */
  recordResult($event: number, i) {
    this.results[i] = $event
  }

  /**
   * Just a wrapper for JSON.stringify to be able access it from HTML
   * @param _input js object
   */
  printQuestion(_input): string {
    return JSON.stringify(_input)
  }

  /**
   * Displays answers and results
   */
  showResults() {
    this.show_results = true
    window.scroll(0,0)
  }

  /**
   * Calculates score of entire quiz
   */
  calculateScore(): number {
    let current_score = 0;
    for (let i = 0; i < this.results.length; i++) {
      current_score += this.results[i]
    }

    return Math.round((current_score / this.results.length) * 10000) / 100
  }

  /**
   * Returns pretty print score of this question
   * @param _score of individual quesiton
   */
  displayQuestionResults(_score): string {
    return Math.floor((_score / this.quiz_questions.length) * 10000) / 100 + " / " + Math.floor((1 / this.quiz_questions.length) * 10000) / 100
  }

}
