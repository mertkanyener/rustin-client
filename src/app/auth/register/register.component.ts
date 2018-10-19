import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../user.model';
import { MainService } from '../../shared/main.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User = new User();

  constructor(private mainService: MainService,
              private router: Router) { }

  ngOnInit() {  
  }

  onRegister(form: NgForm) {
    const value = form.value;
    this.user.username = value.username;
    this.user.email = value.email;
    this.user.password = value.password;
    this.mainService.registerUser(this.user).subscribe(
      (data) => {
        console.log(data);
        alert("User created successfully!")
        this.router.navigate(['login']);
      },
      (error) => {
        console.error("There is an error! ", error);
      }
    )
  }

}
