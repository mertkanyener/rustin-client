import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MainService } from '../../shared/main.service';
import { Router } from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginStatus : number = 0;
  loginClicked : boolean = false;
  subscription : Subscription;

  constructor(private mainService: MainService,
              private router: Router) { }

  onLogin(form: NgForm) {
    this.loginClicked = true;
    const username = form.value.username;
    const password = form.value.password;
    this.mainService.loginUser(username, password);
    this.subscription = this.mainService.status.subscribe(
      (status) => {
        this.loginStatus = status;
      }
    );
    console.log(this.loginStatus);
    console.log(this.loginClicked);
  }

  onCancel() {
    this.router.navigate(['/']);
  }
}
