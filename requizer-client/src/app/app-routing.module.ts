import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizComponent } from './quiz/quiz.component'
import { ConfiguratorComponent } from './configurator/configurator.component'

const routes: Routes = [
  {path: '', component: ConfiguratorComponent},
  {path: 'quiz' , component: QuizComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
