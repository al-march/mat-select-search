import { Component, ElementRef, Host, Input, OnChanges, OnInit, Optional, SimpleChanges, ViewChild, ViewRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime, filter } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'mat-select-search',
  exportAs: 'matSelectSearch',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './mat-select-search.component.html',
  styleUrls: ['./mat-select-search.component.scss']
})
export class MatSelectSearchComponent implements OnInit, OnChanges {

  @ViewChild('input')
  protected input?: ElementRef<HTMLInputElement>;

  @Input()
  items: string[] = [];

  protected filter = new FormControl('');

  options$ = new BehaviorSubject<string[]>([...this.items]);

  constructor(
    @Optional() @Host() private select: MatSelect
  ) {
  }

  ngOnInit(): void {
    this.onFilterChange();
    this.onSelectOpened();
    this.onSelected();
  }

  ngOnChanges(): void {
    this.filterItems();
  }

  private onFilterChange() {
    this.filter.valueChanges
      .pipe(debounceTime(200))
      .subscribe(filter => this.filterItems(filter));
  }

  private onSelectOpened() {
    this.select.openedChange
      .pipe(filter(Boolean))
      .subscribe(() => this.focus());
  }

  private onSelected() {
    this.select.valueChange.subscribe(() => this.reset());
  }

  private filterItems(filter = this.filter.value) {
    if (filter) {
      const filteredItems = this.items.filter(i => i.includes(filter));
      this.options$.next(filteredItems);
      console.log(this.select);

    } else {
      this.options$.next([...this.items]);
    }
  }

  selectFirstOption() {
    this.select.options.first.select();
  }

  focus() {
    this.input?.nativeElement.focus();
  }

  reset() {
    this.filter.reset();
  }
}
