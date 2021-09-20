import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'elder-add',
  templateUrl: './add.component.svg',
  styleUrls: ['./add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
