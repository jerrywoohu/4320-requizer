import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.scss']
})
export class ConfiguratorComponent implements OnInit {

  private modules: Array<any>
  private selected_modules: Array<any>
  private quiz_in_progress: string

  private options: {
    hide_incorrect: boolean,
    number_of_questions: number,
    shuffle: boolean
  }

  constructor(private http: HttpClient) {
    this.modules = []
    this.quiz_in_progress = 'none';
    this.selected_modules = []

    this.options =  {
      hide_incorrect: true,
      number_of_questions: 0,
      shuffle: true
    }
  }

  ngOnInit() {
    this.updateConfig()
  }

  updateConfig(): Promise<void> {
    return new Promise((resolve, reject) => {
      let d = new Date()
      let d_ms = d.getTime()
      this.http.get('assets/config.json' + "?v=" + d_ms)
        .subscribe((data: {'modules': string, 'submodules': string, 'catalog': string}) => {
          this.http.get(data['modules'] + "?v=" + d_ms)
            .subscribe((_modules: Array<any>) => {
              this.modules = _modules
              resolve()
            }, (error) => {
              reject()
            })
        }, (error) => {
          reject()
        })
    })
  }

  onSelection(e, v) {
    this.selected_modules = v.map((a) => {
      // return just the values
      return a.value
    })
  }
  
  getCompleteQuizzes(_quizzes) {
    return _quizzes.filter(a => a.identification)
  }

  normalQuiz() {
    if (this.selected_modules.length > 0) {
      this.quiz_in_progress = 'normal'
      window.scroll(0,0)
    } else {
      alert('No modules selected')
    }
  }

  learnQuiz() {
    if (this.selected_modules.length > 0) {
      this.quiz_in_progress = 'learn'
      window.scroll(0,0)
    } else {
      alert('No modules selected')
    }
  }

  quizDone($e, i) {
    this.selected_modules = []
    this.quiz_in_progress = 'none'
  }

  superQuiz() {
    let total_biaz = []

    for (let i = 0; i < this.modules.length; i++) {
      let submodules = this.getCompleteQuizzes(this.modules[i].submodules)
      total_biaz = total_biaz.concat(submodules)
    }
    
    this.selected_modules = total_biaz
    this.normalQuiz()
  }

}
