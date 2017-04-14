import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Chatroom } from '.././_models/chatroom';

@Injectable()
export class ChatroomService {

  private headers: Headers;
  private options: RequestOptions;

  constructor(private _http :Http) {
    this.headers = new Headers({ 'Authorization': 'JWT '+ localStorage.getItem("token")});
    this.headers.append('Content-Type','application/json');
    this.options = new RequestOptions({'headers':this.headers});
  }

  getChatrooms(): Observable<Chatroom[]>{
    return this._http.get('http://127.0.0.1:8000/mychatrooms/', this.options)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);
  }

  newChatroom(name : string){
      return this._http.post('http://127.0.0.1:8000/newchatroom/',JSON.stringify({'name':name}), this.options)
        .map(response => response.json())
        .toPromise()
        .then(response => {
          if(response && response.name){
              return true;
          }else{
            return false;
          }
        })
        .catch(this._newChatroomErrorHandler);
  }

  _errorHandler(error : Response){
    console.error(error);
    return Observable.throw(error || "Server Error");
  }

  _newChatroomErrorHandler(error : any): boolean{
    console.error(error);
    return false;
  }

}
