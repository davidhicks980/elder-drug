import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-small-logo',
  templateUrl: './small-logo.component.html',
  styleUrls: ['./small-logo.component.scss'],
})
export class SmallLogoComponent implements OnInit {
  @Input() toggle: boolean;
  constructor() {}

  ngOnInit(): void {}
}
