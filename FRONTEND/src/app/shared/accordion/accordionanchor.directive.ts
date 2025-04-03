import { Directive, HostListener } from '@angular/core';
import { AccordionLinkDirective } from './accordionlink.directive';

@Directive({
  selector: '[appAccordionToggle]',
  standalone: true, // 🚀 La hacemos standalone
})
export class AccordionAnchorDirective {
  constructor(private navlink: AccordionLinkDirective) {}

  @HostListener('click', ['$event'])
  onClick() {
    this.navlink.toggle();
  }
}
