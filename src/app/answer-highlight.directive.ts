import {Directive, ElementRef, OnInit} from '@angular/core';
import {NgControl} from "@angular/forms";
import {map} from "rxjs";

@Directive({
  selector: '[appAnswerHighlight]',
  standalone: true
})
export class AnswerHighlightDirective implements OnInit {

  constructor(private elRef: ElementRef, private controlName: NgControl) {
  }

  ngOnInit(): void {
    this.controlName.control?.parent?.valueChanges.pipe(
      map(({a, b, answer}) => {
        console.log(Math.abs((a + b - answer) / (a + b)));
        return Math.abs((a + b - answer) / (a + b));
      }))
      .subscribe(val => {
        if (val < 0.2) {
          this.elRef.nativeElement.classList.add('highlight');
        }
        else {
          this.elRef.nativeElement.classList.remove('highlight');
        }
      });
  }

}
