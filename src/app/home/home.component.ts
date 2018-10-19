import { Component, OnInit } from '@angular/core';
import { MainService } from '../shared/main.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private mainService: MainService) { }

  ngOnInit() {
    if (this.mainService.isAuthenticated()) {
      let token = this.mainService.getToken();
      console.log("Acess Token: ", token.access_token);
      console.log("User Id: " ,token.userId);
      console.log("Token type: ", token.token_type)
      console.log("Scope", token.scope);

    }
  }

}
