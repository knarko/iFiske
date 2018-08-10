import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AdminPermitSearchResult } from '../../providers/admin/admin';

@Component({
  selector: '[highlight]',
  templateUrl: 'highlight.html',
})
export class HighlightComponent implements OnChanges {
  parts: Array<{ text: string; match?: boolean }>;

  @Input('highlight')
  key: string;
  @Input()
  permit: AdminPermitSearchResult;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.key || changes.permit) {
      this.updateParts();
    }
  }

  updateParts() {
    let result: string = String(this.permit[this.key]);
    const match = this.permit.matches && this.permit.matches.find(m => m.key === this.key);
    if (match) {
      this.parts = [];
      let location = 0;
      for (const [start, end] of match.indices) {
        this.parts.push(
          { text: result.slice(location, start) },
          { match: true, text: result.substring(start, end + 1) },
        );
        location = end + 1;
      }
      this.parts.push({ text: result.slice(location) });
    } else {
      this.parts = [{ text: result }];
    }
  }
}
