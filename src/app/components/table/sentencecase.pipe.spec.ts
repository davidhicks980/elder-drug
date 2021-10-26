import { SentenceCasePipe } from './sentencecase.pipe';

describe('SentencecasePipe', () => {
  it('create an instance', () => {
    const pipe = new SentenceCasePipe();
    expect(pipe).toBeTruthy();
  });
});
