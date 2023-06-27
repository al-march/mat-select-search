import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSelectSearchComponent } from './mat-select-search.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MatOption } from '@angular/material/core';

describe('MatSelectSearchComponent', () => {
  let component: MatSelectSearchExample;
  let fixture: ComponentFixture<MatSelectSearchExample>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatSelectSearchExample],
      imports: [
        MatSelectSearchComponent,
        NoopAnimationsModule,
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MatSelectSearchExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const debugSelect = () => fixture.debugElement.query(By.css('#select'));
  const debugInput = () => fixture.debugElement.query(By.css('.select-search-input'));
  const debugOptions = () => fixture.debugElement.queryAll(By.css('mat-option'))

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should has a search field', () => {
    const select = debugSelect().nativeElement as HTMLElement;
    select.click();
    fixture.detectChanges();
    expect(debugInput().nativeElement).toBeTruthy();
  });

  it('should show all options', () => {
    const select = debugSelect().nativeElement as HTMLElement;
    select.click();
    fixture.detectChanges();

    const optionsLenght = component.items.length;
    expect(debugOptions().length).toBe(optionsLenght);
    debugOptions().forEach((option, index) => {
      const matOption = option.componentInstance as MatOption;
      expect(matOption.value).toBe(component.items[index]);
    });
  });

  it('should input be focused', async () => {
    const select = debugSelect().nativeElement as HTMLElement;
    select.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(debugInput().nativeElement).toBe(document.activeElement);
  })

  it('should filtering', async () => {
    const select = debugSelect().nativeElement as HTMLElement;
    select.click();
    fixture.detectChanges();

    const input = debugInput();
    const firstItem = component.items[component.items.length - 1];
    input.nativeElement.value = firstItem;
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    const firstOption = debugOptions().find(opt => {
      return opt.nativeElement.style.display !== 'none';
    });

    expect(firstOption?.componentInstance.value).toBe(firstItem)
  })
});


@Component({
  template: `
    <mat-form-field id="field">
      <mat-select id="select">
        <mat-select-search id="select-search"/>

        <mat-option *ngFor="let item of items" [value]="item">
          {{ item }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
})
class MatSelectSearchExample {
  items = ['one', 'two', 'three', 'four', 'five', 'six', 'seven'];
}
