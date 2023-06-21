import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MAT_SELECT_SEARCH, MatSelectSearchComponent } from "./mat-select-search/mat-select-search.component";

@NgModule({
  declarations: [
    AppComponent,
  ],
  providers: [{
    provide: MAT_SELECT_SEARCH,
    useValue: {
      placeholder: 'Start typing...',
    }
  }],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSelectSearchComponent,
    MatButtonModule
  ]
})
export class AppModule { }
