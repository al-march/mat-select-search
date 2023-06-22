import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Host, Inject, InjectionToken, Input, OnChanges, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOption } from '@angular/material/core';

export type MatSelectSearchConfig = {
  label?: string;
  placeholder?: string;
  notFoundLabel?: string;
  sticky?: boolean;
}

const defaultConfig: MatSelectSearchConfig = {
  label: 'Search',
  placeholder: 'text to find',
  notFoundLabel: 'Nothing is found',
  sticky: true,
}

export const MAT_SELECT_SEARCH = new InjectionToken<MatSelectSearchConfig>(
  'mat-select-search-token'
);

function setConfigValue(config: MatSelectSearchConfig, key: keyof MatSelectSearchConfig) {
  if (key in config) {
    return config[key];
  } else {
    return defaultConfig[key];
  }
}

@Component({
  selector: 'mat-select-search',
  exportAs: 'matSelectSearch',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './mat-select-search.component.html',
  styleUrls: ['./mat-select-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatSelectSearchComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild('input')
  input?: ElementRef<HTMLInputElement>;

  @Input()
  label = setConfigValue(this.config, 'label') as string;

  @Input()
  placeholder = setConfigValue(this.config, 'placeholder') as string;

  @Input()
  notFoundLabel = setConfigValue(this.config, 'notFoundLabel') as string;

  @Input()
  sticky = setConfigValue(this.config, 'sticky');

  @Output()
  filterChange = new EventEmitter<string | null>();

  filter = new FormControl('');
  isNothingFound = false;

  constructor(
    @Optional() @Host() private select: MatSelect,
    @Optional() @Inject(MAT_SELECT_SEARCH) private config: MatSelectSearchConfig,
    private ref: ChangeDetectorRef
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

  ngAfterViewInit(): void {
    // Skip hidden options 
    this.select._keyManager.skipPredicate((option) => {
      return !this.isOptionActive(option);
    })

    // Scroll to focused option by the bottom
    // This behavior needs because search input
    // may be sticky
    this.select._keyManager.change.subscribe(() => {
      const activeOption = this.select._keyManager.activeItem;
      if (activeOption instanceof MatOption) {
        const el = activeOption._getHostElement();
        el.scrollIntoView({ block: 'end', behavior: 'smooth' })
      }
    })
  }

  private onFilterChange() {
    this.filter.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(100)
      ).subscribe((filter) => {
        this.filterItems(filter);
        this.focusFirstOption();
        this.updateIsNothingFoundState();
        this.filterChange.emit(filter);
      });
  }

  private onSelectOpened() {
    this.select.openedChange.subscribe((opened) => {
      if (opened) {
        this.focus();
      }
    });
  }

  private onSelected() {
    this.select.valueChange
      .pipe(filter(() => !this.select.multiple))
      // If reset filter matSelect may change focused
      // option in the last moment
      // .subscribe(() => this.reset());
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
    this.select.options?.forEach(opt => {
      const el = opt._getHostElement();
      if (el) {
        el.style.display = 'flex';
      }
    })
  }

  private focusFirstOption() {
    const option = this.select.options.find((opt) => {
      if (this.isOptionActive(opt)) {
        return true;
      }
      return false;
    });
    if (option instanceof MatOption) {
      this.select._keyManager.setActiveItem(option);
    }
  }

  focus() {
    this.input?.nativeElement.focus();
  }

  refocus() {
    setTimeout(() => {
      this.focus();
    })
  }

  reset() {
    this.filter.reset();
  }

  private isOptionActive(option: MatOption) {
    const el = option._getHostElement();
    if (el instanceof HTMLElement) {
      return el.style.display !== 'none';
    }
    return false;
  }

  private updateIsNothingFoundState() {
    this.isNothingFound = this.checkIsNothingFound();
    this.ref.markForCheck();
  }

  private checkIsNothingFound() {
    for (let opt of this.select.options) {
      if (this.isOptionActive(opt)) {
        return false;
      }
    }
    return true;
  }
}
