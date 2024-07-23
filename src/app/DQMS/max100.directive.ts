import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMax100]'
})
export class Max100Directive {

  constructor(private ngControl: NgControl) { }
  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const currentValue = parseInt(value, 10);
    if (!isNaN(currentValue) && currentValue > 100 && this.ngControl?.control) {
      this.ngControl.control.setValue('100');
    }
  }

}
