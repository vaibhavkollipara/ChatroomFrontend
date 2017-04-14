import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthenticationService {
  public token: string;
  public headers :Headers;
  public logger :Subject<boolean>;

  constructor(private _http :Http) { 
    this.logger = new BehaviorSubject<boolean>(false);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    let token = localStorage.getItem("token");
    if(token){
      this.token = token;
      this.setLoggerStatus(true);
    }
  }

  authenticate(username:string, password:string){
      //console.log(JSON.stringify({ "username": username, "password": password }));
      let return_value = false;
               return this._http.post('http://127.0.0.1:8000/auth/obtaintoken/', 
                                JSON.stringify({ "username": username, "password": password }),
                                {headers:this.headers})
                                .map(res => res.json())
                                .toPromise()
                                .then(response => {
                                      if(response && response.token){
                                          this.token = response.token;
                                          localStorage.setItem("token",this.token);
                                            return this._setUserDetails().then((res) => {
                                              if(res){
                                                this.setLoggerStatus(res);
                                              }
                                              return res;
                                            });
                                      }else{
                                        return false;
                                      }
                                })
                                .catch(this._errorHandler);
  }

   _setUserDetails() {
        let headers = new Headers({ 'Authorization': 'JWT '+ this.token});
        headers.append('Content-Type','application/json');
        let options = new RequestOptions({'headers':headers});
        return this._http.get('http://127.0.0.1:8000/accounts/mydetails/', options)
                .map(res => res.json())
                .toPromise()
                .then(response => {
                  if(response && response.fullname){
                      localStorage.setItem("currentUser",JSON.stringify(response));
                      return true;
                    }else{
                      return false;
                  }
                });

  }

  register(firstname:string, lastname :string, email :string, username :string, password :string){
    return this._http.post('http://127.0.0.1:8000/accounts/signup/',
                    JSON.stringify({'first_name': firstname, 'last_name': lastname, 'email': email, 'username': username,
                                    'password': password}),
                    {'headers' : this.headers})
        .map(response => response.json())
        .toPromise()
        .then(response => {
          if(response && response.username){
              return true;
          }else{
            return false;
          }
        })
        .catch(this._errorHandler);
  }

  handleResponse(header){
    console.log("Response status : "+ header.status);
      if(header.status != 401)
        return true;
      else
        return false;
  }

  setLoggerStatus(value:boolean){
      this.logger.next(value);
  }


  isLoggedIn(): Observable<boolean>{
    return this.logger.asObservable();
  }

  _errorHandler(error: Response){
    console.log("Error : "+error);
    //return Observable.throw(error || "Server Error");
    return false;
  }

  logout(){
    this.token = null;
    localStorage.removeItem("currentUser");
    localStorage.removeItem('token');
    this.setLoggerStatus(false);
  }
}
