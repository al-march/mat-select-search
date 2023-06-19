import { Component, ElementRef, Host, Input, OnChanges, OnInit, Optional, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
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
  input?: ElementRef<HTMLInputElement>;

  @Input()
  placeholder = 'Search'

  filter = new FormControl('');

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
      .pipe(
        distinctUntilChanged(),
        debounceTime(200)
      ).subscribe(filter => this.filterItems(filter));
  }

  private onSelectOpened() {
    this.select.openedChange
      .pipe(filter(Boolean))
      .subscribe(() => this.focus());
  }

  private onSelected() {
    this.select.valueChange
      .pipe(filter(() => !this.select.multiple))
      .subscribe(() => this.reset());
  }

  private filterItems(filter = this.filter.value) {
    if (filter) {
      this.select.options.forEach(opt => {
        const el = opt._getHostElement();
        if (el) {
          if (!opt.viewValue.includes(filter)) {
            el.style.display = 'none';
          } else {
            el.style.display = 'flex';
          }
        }
      })
    } else {
      this.showAllOptions();
    }
  }

  private showAllOptions() {
    this.select.options.forEach(opt => {
      const el = opt._getHostElement();
      if (el) {
        el.style.display = 'flex';
      }
    })
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
