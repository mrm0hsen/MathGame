import {Directive, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {NgControl} from "@angular/forms";
import {map, Subscription} from "rxjs";

@Directive({
  selector: '[appAnswerHighlight]',
  standalone: true
})
export class AnswerHighlightDirective implements OnInit,OnDestroy {
  sub: Subscription | undefined;

  constructor(private elRef: ElementRef, private controlName: NgControl) {
  }

  ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

  ngOnInit(): void {
    this.sub = this.controlName.control?.parent?.valueChanges.pipe(
      map(({a, b, answer}) => {
        console.log(Math.abs((a + b - answer) / (a + b)));
        return Math.abs((a + b - answer) / (a + b));
      }))
      .subscribe(val => {
        if (val < 0.2) {
          this.elRef.nativeElement.classList.add('highlight');
        } else {
          this.elRef.nativeElement.classList.remove('highlight');
        }
      });
  }

}
