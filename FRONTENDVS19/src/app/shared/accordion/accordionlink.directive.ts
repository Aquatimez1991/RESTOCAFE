import {
  Directive,
  HostBinding,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';
import { AccordionDirective } from './accordion.directive';

@Directive({
  selector: '[appAccordionLink]',
  standalone: true, // 🚀 La hacemos standalone
})
export class AccordionLinkDirective implements OnInit, OnDestroy {
  @Input()
  public group: any;

  @HostBinding('class.selected')
  @Input()
  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
    if (value) {
      this.nav.closeOtherLinks(this);
    }
  }

  private _selected = false;

  constructor(private nav: AccordionDirective) {}

  ngOnInit(): void {
    this.nav.addLink(this);
  }

  ngOnDestroy(): void {
    this.nav.removeGroup(this);
  }

  toggle(): void {
    this.selected = !this.selected;
  }
}
