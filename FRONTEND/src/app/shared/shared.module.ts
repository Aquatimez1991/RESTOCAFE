import { Directive, Injectable } from '@angular/core';

// Importar directivas originales
import { AccordionAnchorDirective } from './accordion/accordionanchor.directive';
import { AccordionLinkDirective } from './accordion/accordionlink.directive';
import { AccordionDirective } from './accordion/accordion.directive';

// Servicio MenuItems
import { MenuItems } from './menu-items';

@Directive({
  selector: '[appSharedModule]',
  standalone: true,
  providers: [MenuItems], 
  hostDirectives: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective
  ]
})
export class SharedModule {}
