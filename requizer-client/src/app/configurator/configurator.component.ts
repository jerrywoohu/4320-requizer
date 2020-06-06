import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['../mystyles.scss', './configurator.component.scss']
})
export class ConfiguratorComponent implements OnInit {

  private modules: Array<any>
  private selected_modules: Array<any>
  private quiz_in_progress: string
  private packetTracingTable: {input: string, table: string}

  private options: {
    hide_incorrect: boolean,
    number_of_questions: number,
    shuffle: boolean
  }

  constructor(private http: HttpClient) {
    this.modules = []
    this.quiz_in_progress = 'none';
    this.selected_modules = []
    this.packetTracingTable = {
      input: '', 
      table: ''
    }

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

  formatTracingTable() {
    let lines = this.packetTracingTable.input.split('\n')
    let output = []
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].includes('Answer') && !lines[i].includes(':')) {
        output.push(lines[i].trim())
      }
    }

    let table = ''
    table += '<tr><td>Seg.</td><td>MAC D.</td><td>MAC S.</td><td>Type</td><td>IP D.</td><td>IP S.</td><td>Prot #</td><td>Port D.</td><td>Port S.</td><td>Flags</td></tr>'
    
    if (output.length == 50 || output.length == 40) {
      for (let i = 0; i < output.length / 10; i++) {
        table += '<tr>'
        for (let j = 0; j < 10; j++) {
          table += '<td>' + output[(i * 10) + j] + '</td>'
        }
        table += '</tr>'
      }
    } else if (output.length == 46) {
      for (let i = 0; i < 5; i++) {
        table += '<tr>'
        if (i == 0) {
          table += '<td>' + output[0] + '</td>'
          for (let j = 0; j < 9; j++) {
            // first row
            table += '<td>' + output[j + 1] + '</td>'
          }
        } else {
          table += '<td>s</td>'
          for (let j = 0; j < 9; j++) {
            table += '<td>' + output[(i * 9) + j + 1] + '</td>'
          }
        }
        table += '</tr>'
      }
    } else {
      table += '<tr><td>Invalid Input</td></tr>'
    }

    // this.copyToClipboard(table)

    this.packetTracingTable.table = table
  }

  copyPacketTable() {
    this.copyElToClipboard(document.getElementById('packet-table'))
  }

  copyElToClipboard(el) {
    let body = document.body, range, sel;
    if (document.createRange && window.getSelection) {
        range = document.createRange();
        sel = window.getSelection();
        sel.removeAllRanges();
        try {
            range.selectNodeContents(el);
            sel.addRange(range);
        } catch (e) {
            range.selectNode(el);
            sel.addRange(range);
        }
        document.execCommand("copy");

    }
  }

}
