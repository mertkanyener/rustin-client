import { Component } from '@angular/core';
import { MainService } from './shared/main.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'project-client';

  constructor(private mainService: MainService) { 
  }


}
