import { Component } from '@angular/core';
import { MainService } from '../shared/main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private mainService: MainService,
              private router: Router) { }
  onLogout(){
    this.mainService.logout();
    this.router.navigate(['']);
    }

}
