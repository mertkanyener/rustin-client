import { Component, OnInit } from '@angular/core';
import { MainService } from '../shared/main.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  username: string;

  constructor(private mainService: MainService,
              private router: Router) { }


  ngOnInit(){
    if (this.mainService.isAuthenticated()) {
      this.username = localStorage.getItem('username');
    }
  }

  onProjectList(){
    this.mainService.showLoadingSpinner();
    this.router.navigate(['/projects']);
  }
}
