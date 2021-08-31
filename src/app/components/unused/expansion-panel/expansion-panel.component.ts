import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { Component, OnInit } from '@angular/core';
import { matExpansionAnimations, MatExpansionPanelState } from '@angular/material/expansion';

@Component({
  selector: 'elder-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss'],
  animations: [
    matExpansionAnimations.bodyExpansion,
    matExpansionAnimations.indicatorRotate,

    trigger('revealContentText', [
      state('expanded', style({ opacity: 0 })),
      state('collapsed', style({ opacity: 1 })),
      transition('expanded <=> collapsed', animate('200ms ease')),
    ]),
  ],
})
export class ExpansionPanelComponent
  extends CdkAccordionItem
  implements OnInit {
  ngOnInit() {}

  getExpandedState(): MatExpansionPanelState {
    return this.expanded ? 'expanded' : 'collapsed';
  }
}
