import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { User } from '../user.model';
import { MainService } from '../../shared/main.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User = new User();
  formBuilder = new FormBuilder();
  registerForm : FormGroup;

  constructor(private mainService: MainService,
              private router: Router,
              private http: HttpClient) { }
  
  checkPasswords(c: AbstractControl) {
    const password: string = c.get('password').value;
    const confirmPassword: string = c.get('confirmPassword').value;
    if  (password !== confirmPassword) {
      c.get('confirmPassword').setErrors({ 'NoPassMatch' : true });
    }
  }
  
  ngOnInit() {
    this.initForm();
    this.registerForm.statusChanges.subscribe(
      (status) => console.log(status)
    )  
  }

  private initForm(){
    this.registerForm = this.formBuilder.group({
      username: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern("[a-zA-Z0-9]*")], this.usernameValidation.bind(this)],
      email: [null, [Validators.required, Validators.email], this.emailValidation.bind(this)],
      passwords: this.formBuilder.group({
        password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
        confirmPassword: [null]
      }, { validator: this.checkPasswords } )
    });  
  }

  onRegister() {
    const value = this.registerForm.value;
    this.user.username = value.username;
    this.user.email = value.email;
    this.user.password = value.passwords.password;
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
  onCancel(){
    this.router.navigate(['/']);
  }

  usernameValidation(c: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors>{
    return this.mainService.isUsernameExists(c.value);
  }

  emailValidation(c: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors>{
    return this.mainService.isEmailExists(c.value);
  }

}
