import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sentencecase',
})
export class SentenceCasePipe implements PipeTransform {
  matchSentenceEnd = RegExp(/[.!?]\s+/gi);
  sentenceCase(sentences: string): string {
    const separators = sentences.match(this.matchSentenceEnd);
    if (separators == null) {
      return sentences.charAt(0).toUpperCase() + sentences.slice(1);
    }
    return sentences
      .split(this.matchSentenceEnd)
      .map(
        (sentence, i) =>
          (i - 1 >= 0 ? separators[i - 1] : '') +
          sentence?.charAt(0)?.toUpperCase() +
          sentence?.slice(1)
      )
      .join('');
  }
  transform(value: unknown): unknown {
    return value && typeof value === 'string' ? this.sentenceCase(value) : value;
  }
}
