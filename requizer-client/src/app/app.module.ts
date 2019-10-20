import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Angular Material Components
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCheckboxModule} from '@angular/material';
import {MatButtonModule} from '@angular/material';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';

import { QuizComponent } from './quiz/quiz.component';
import { ConfiguratorComponent } from './configurator/configurator.component';
import { MultipleChoiceQuestionComponent } from './questiontypes/multiple-choice-question/multiple-choice-question.component';
import { ShortAnswerQuestionComponent } from './questiontypes/short-answer-question/short-answer-question.component';
import { MultipleAnswersQuestionComponent } from './questiontypes/multiple-answers-question/multiple-answers-question.component';
import { FillInMultipleBlanksQuestionComponent } from './questiontypes/fill-in-multiple-blanks-question/fill-in-multiple-blanks-question.component';
import { MatchingQuestionComponent } from './questiontypes/matching-question/matching-question.component';
import { MultipleDropdownsQuestionComponent } from './questiontypes/multiple-dropdowns-question/multiple-dropdowns-question.component';
import { NumericalAnswerQuestionComponent } from './questiontypes/numerical-answer-question/numerical-answer-question.component';
import { TrueFalseQuestionComponent } from './questiontypes/true-false-question/true-false-question.component';


@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    ConfiguratorComponent,
    MultipleChoiceQuestionComponent,
    ShortAnswerQuestionComponent,
    MultipleAnswersQuestionComponent,
    FillInMultipleBlanksQuestionComponent,
    MatchingQuestionComponent,
    MultipleDropdownsQuestionComponent,
    NumericalAnswerQuestionComponent,
    TrueFalseQuestionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
