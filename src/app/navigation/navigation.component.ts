import { Component, ViewChild, ElementRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  name: string;
  timeoutHandler;
  timer;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  public drugs: any[] = [
    {
      id: '',
      name: '',
    },
  ];
  i: number;
  addDrug() {
    let index = this.drugs.length + 1;
    if (this.drugs.length <= 30) this.drugs.push({ id: index, name: '' });
  }

  removeDrug(i: number) {
    if (this.drugs.length > 1) {
      this.drugs.splice(i, 1);
    }
  }

  constructor(private breakpointObserver: BreakpointObserver) {}
}
