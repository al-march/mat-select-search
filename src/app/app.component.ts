import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  items = ['one', 'two', 'three', 'four'];
  filteredItems = [...this.items];

  filter(value: string) {
    const v = value.trim().toLowerCase();
    this.filteredItems = this.items.filter(item => item.includes(v));
  }
}
