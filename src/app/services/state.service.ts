import { BehaviorSubject } from 'rxjs';

export class StateService {
  private stateSource: BehaviorSubject<Record<string, string | string[] | Record<string, string>>> =
    new BehaviorSubject({});
  state$ = this.stateSource.asObservable();
  /*private produceState(state: Record<string, string | string[] | Record<string, string>>) {
    return produce(this.stateSource.value, (draft) => {
      draft = { ...draft, ...state };
    });
  }

  updateState(state: Record<string, string>) {
    this.stateSource.next(this.produceState(state));
  }
*/
  constructor() {}
}
