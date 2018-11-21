import { Component, OnInit } from '@angular/core';
import { MainService } from '../shared/main.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private mainService: MainService,
              private router: Router) { }

  onProjectList(){
    this.mainService.getAllProjects();
    this.router.navigate(['/projects']);
  }
}
