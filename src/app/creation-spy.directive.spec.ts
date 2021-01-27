import { CreationSpyDirective } from './creation-spy.directive';

describe('CreationSpyDirective', () => {
  it('should create an instance', () => {
    const directive = new CreationSpyDirective();
    expect(directive).toBeTruthy();
  });
});
