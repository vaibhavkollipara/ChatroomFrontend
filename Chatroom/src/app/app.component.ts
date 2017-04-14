import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { User } from './_models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Chatroom';
  user : User;
  loginSubscription : any ;
  timerSubscription : any;

  constructor(private _auth : AuthenticationService){
   }

   getLoginStatus(){
     this.loginSubscription = this._auth.isLoggedIn().subscribe(value => {
                                if(value){
                                  this.user = JSON.parse(localStorage.getItem("currentUser"));
                                }else{
                                  this.user = null;
                                }
                                this.subscribeTimer();
                                //console.log("Checked Login Staus");
                              });
   }

   subscribeTimer(){
     this.timerSubscription = Observable.timer(3000).first().subscribe(() => this.getLoginStatus());
   }

  ngOnInit(){
    this.getLoginStatus();
    console.log("App Init");
  }
  ngOnDestroy() {
    console.log("App Destroy");
    this.loginSubscription.unsubscribe();
    this.loginSubscription.unsubscribe();
  }

  logout(){
    this._auth.logout();
  }
}
