import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  meps: string[] = []

  ngOnInit() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        this.meps.push(key.split(':')[1]);
      }
    }
  }

}
