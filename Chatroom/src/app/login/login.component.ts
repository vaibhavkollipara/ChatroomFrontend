import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '.././authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers : [AuthenticationService ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm : FormGroup;
  signUpForm : FormGroup;
  errorMsg: boolean = false;
  loading: boolean = false;
  
  constructor(private _auth : AuthenticationService,
    private _formBuilder : FormBuilder,
    private _router : Router) { }

  ngOnInit() {
    this._auth.logout();
    //console.log("Login Auth Check : "+this._auth.isAuthenticated());
    this.loginForm = this._formBuilder.group({
      username : ["",[Validators.required]],
      password : ["",[Validators.required]]
    });

    this.signUpForm = this._formBuilder.group({
      first : ["",[Validators.required, Validators.minLength(4)]],
      last : ["",[Validators.required, Validators.minLength(4)]],
      email: ["",[Validators.required, Validators.email]],
      username : ["",[Validators.required, Validators.minLength(4)]],
      password : ["",[Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnDestroy(){
    //this.loginsub.unsubscribe();
  }

  login(){
    //console.log(this.loginForm.value);
    this.loading = true;
    this._auth.authenticate(this.loginForm.value.username, this.loginForm.value.password)
            .then((res) => {
              if(res){
                console.log("Received True");
                this._router.navigate(['/home']);
                this.errorMsg = false;
                this.loginForm.reset();
              }else{
                console.log("Received False");
                this.errorMsg = true;
              }
              this.loading = false;
            });
  }

  signUp(){
      this.loading = true;
      let value = this.signUpForm.value;
      this._auth.register(value.first,value.last,value.email,value.username,value.password)
              .then(res => {
                  if(res){
                    alert("Registration Successful");
                    this.signUpForm.reset();
                  }else{
                    alert("Something wrong with the details provided.. Please verify and try again");
                  }
                  this.loading = false;
              });

  }



  isLoginSubmitable(): boolean{
    if(!this.loginForm.valid || this.loading)
      return true;
    else
      return false;
  }

  isSignupSubmitable(): boolean{
    if(!this.signUpForm.valid || this.loading)
      return true;
    else
      return false;
  }

}
