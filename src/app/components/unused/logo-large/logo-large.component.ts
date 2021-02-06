import { Component, OnInit } from '@angular/core';

import { fadeInAnimation } from '../../../animations';


@Component({
  selector: 'elder-logo-large',
  templateUrl: './logo-large.component.html',
  styleUrls: ['./logo-large.component.scss'],
  animations: [fadeInAnimation],
})
export class LogoLargeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
