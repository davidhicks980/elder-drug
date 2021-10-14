import {
  animate,
  AnimationBuilder,
  AnimationFactory,
  AnimationPlayer,
  style,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';

import { ColumnService } from '../../../services/columns.service';
import { FilterService } from '../../../services/filter.service';
import { GroupByService } from '../../../services/group-by.service';
import { TableService } from '../../../services/table.service';

@Component({
  selector: 'elder-table-card',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.scss'],
  providers: [GroupByService, ColumnService, FilterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCardComponent implements OnInit {
  @Input() icon: string;
  previousTable: number;
  tableTransitions: { forwards: AnimationFactory; reverse: AnimationFactory };
  animating: boolean = false;
  createAnimations(distance: string): { forwards: AnimationFactory; reverse: AnimationFactory } {
    let anime = (translate: string) =>
      this.animation.build([
        style({ transform: `translateX(${translate})`, opacity: 0 }),
        animate('250ms ease-in-out', style({ transform: 'translateX(0px)', opacity: 1 })),
      ]);
    return { forwards: anime(distance), reverse: anime('-' + distance) };
  }
  ngOnInit() {
    this.tableTransitions = this.createAnimations('15px');
    let hookAnimation = ((player: AnimationPlayer, finished: boolean) => () => {
      if (finished) player.destroy();
      this.animating = !finished;
    }).bind(this);
    this.tableService.selection$.pipe(distinctUntilChanged()).subscribe((table) => {
      let { tableNumber } = table;
      if (tableNumber != this.previousTable && !this.animating) {
        let direction: 'forwards' | 'reverse' =
          tableNumber < this.previousTable ? 'reverse' : 'forwards';
        let anime = this.tableTransitions[direction].create(this.element.nativeElement);
        anime.onDone(hookAnimation(anime, true));
        anime.onStart(hookAnimation(anime, false));
        anime.play();
        this.previousTable = tableNumber;
      }
    });
  }
  constructor(
    private columnService: ColumnService,
    private groupService: GroupByService,
    private tableService: TableService,
    private filterService: FilterService,
    private renderer: Renderer2,
    private element: ElementRef,
    private animation: AnimationBuilder
  ) {}
}
