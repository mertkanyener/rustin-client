import {Component, OnInit} from '@angular/core';
import { MainService } from './shared/main.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'Rest-in Client';

  constructor(private mainService: MainService) {

  }

  ngOnInit() {
    console.log("token", localStorage.getItem('access_token'));
    if (localStorage.getItem('access_token') != 'undefined') {
      this.mainService.init();
      console.log(this.mainService.getOptions());
    }
  }

}
