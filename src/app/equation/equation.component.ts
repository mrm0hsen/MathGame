import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {JsonPipe, NgClass} from "@angular/common";
import {MathValidations} from "../_validations/math-validations";
import {debounceTime, delay, filter, scan, Subscription} from "rxjs";
import {AnswerHighlightDirective} from "../answer-highlight.directive";

@Component({
  selector: 'app-equation',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    NgClass,
    AnswerHighlightDirective
  ],
  templateUrl: './equation.component.html',
  styleUrl: './equation.component.css'
})
export class EquationComponent implements OnInit, OnDestroy {
  public sub: Subscription | undefined;
  public correct: number = 0;
  public secondPerSolution: number = 0;
  mathForm = new FormGroup({
      a: new FormControl(this.randomNumber()),
      b: new FormControl(this.randomNumber()),
      answer: new FormControl(null)
    },
    [

      MathValidations.additional('answer', 'a', 'b')


    ]);

  public get a() :number{
    return Number(this.mathForm.get('a')?.value);
  }

  public get b():number {
    return Number(this.mathForm.get('b')?.value);
  }

  ngOnInit(): void {
    this.sub = this.mathForm.statusChanges.pipe(
      //delay(250),
      //Wait for type end
      debounceTime(250),
      filter((response) => response === "VALID"),
      scan((acc) => {
        return {
          userAnswer: this.correct++,
          startTime: acc.startTime
        };
      }, {userAnswer: 0, startTime: new Date()})
    ).subscribe(({startTime}) => {
      this.secondPerSolution = (new Date().getTime() - startTime.getTime()) / this.correct / 1000
      //setValue=> YOU MUST ENTER ALL VALUE , patchValue=> you can do everything
      this.mathForm.patchValue({
        a: this.randomNumber(),
        b: this.randomNumber(),
        answer: null
      });
    });
  }

  randomNumber() {
    return Math.floor(Math.random() * 10);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  highlightValidation(numberOne: number , numberTwo: number , answer: number) {
    if ((numberOne + numberTwo) === answer) {
      return true;
    }
    return false;
  }

  protected readonly Number = Number;
}
