import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appMessage]',
  standalone: true,
})
export class MessageDirective {
  private elementRef = inject(ElementRef);

  // constructor(private elementRef: ElementRef) {
  //   elementRef.nativeElement.inner;
  // }
}
