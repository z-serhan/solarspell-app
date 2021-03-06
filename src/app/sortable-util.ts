import { Content } from './models/content';
import { Directive, Input, EventEmitter, Output } from '@angular/core';

export type SortColumn = keyof Content | '';
export type SortDirection = 'asc' | 'desc';
export const rotate: {[key: string]: SortDirection} = { 'asc': 'desc','desc': 'asc'};
export const compare = (v1, v2) => v1.localeCompare(v2);

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class SortableHeader {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = 'asc';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}