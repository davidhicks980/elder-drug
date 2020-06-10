import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WebsocketService } from '../websocket.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  providers: [WebsocketService],
})
export class NavigationComponent {
  //@ViewChildren('searchInputs') submission: ElementRef;
  @ViewChild('drawer') public sidenav: MatSidenav;
  close() {
    this.sidenav.close();
  }

  constructor(public webSocketService: WebsocketService) {}
}
