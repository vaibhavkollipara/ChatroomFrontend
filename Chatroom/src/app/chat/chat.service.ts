import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ChatMessage } from '.././_models/chatmessage';
import { RoomMember } from '.././_models/roommember';



@Injectable()
export class ChatService {

  private headers: Headers;
  private options: RequestOptions;

  constructor(private _http :Http) {
    this.headers = new Headers({ 'Authorization': 'JWT '+ localStorage.getItem("token")});
    this.headers.append('Content-Type','application/json');
    this.options = new RequestOptions({'headers':this.headers});
   }

  getMessages(slug:string) : Observable<ChatMessage> {
    return this._http.get('http://127.0.0.1:8000/chatroom/'+slug+'/', this.options)
            .map((response: Response) => {
              //console.log("Service : \n"+JSON.stringify((response.json() as ChatMessage)));
              return response.json() as ChatMessage;})
            .catch(this._errorHandler);
  }

  getMembers(slug:string): Observable<RoomMember[]>{
    return this._http.get('http://127.0.0.1:8000/chatroom/'+slug+'/memberslist/', this.options)
            .map((response: Response) => {
              //console.log("Service : \n"+JSON.stringify((response.json() as ChatMessage)));
              return response.json() as RoomMember[];})
            .catch(this._errorHandler);
  }

  newMessage(slug : string,message : string){
      return this._http.post('http://127.0.0.1:8000/chatroom/'+slug+'/newmessage/',JSON.stringify({'message':message}), this.options)
        .map(response => response.json())
        .toPromise()
        .then(response => {
          if(response && response.message){
              return true;
          }else{
            return false;
          }
        })
        .catch(this._newMessageErrorHandler);
  }

  newMember(slug : string, username : string){
      return this._http.post('http://127.0.0.1:8000/chatroom/'+slug+'/newmember/',JSON.stringify({'username':username}), this.options)
        .map(response => response.json())
        .toPromise()
        .then(response => {
          if(response && response.username){
              return true;
          }else{
            return false;
          }
        })
        .catch(this._newMemberErrorHandler);
  }

  exitChatrom(slug:string){
      return this._http.delete('http://127.0.0.1:8000/chatroom/'+slug+'/exit/',this.options)
        .toPromise()
        .then(res =>{
          console.log("Exit room Service"+res);
          return true;
        })
        .catch(this._exitChatroomErrorHandler);
  }

  getUserSuggestions(searchstring: string){
      return this._http.get('http://127.0.0.1:8000/accounts/users/?search='+searchstring,this.options)
        .map(response => response.json())
        .toPromise()
        .then(response => {
             if(response && response.count>0){
              return response.results;
            }
        });

  }


_exitChatroomErrorHandler(error : any){
      console.error(error || "Problem Exiting this chatroom");
      return false;
  }


_newMemberErrorHandler(error : any){
      console.error(error || "Problem Adding new member");
      return false;
  }

  _newMessageErrorHandler(error : any){
      console.error(error || "Problem Sending Message");
      return false;
  }

  _errorHandler(error : any){
      console.error(error ||"Chat Service Error");
      return Observable.throw(error || "Server Error");
  }

  // sendMessage(slug:string,message:string){
  //   let headers = new Headers({ 'Authorization': 'JWT '+ this._auth.token});
  //   headers.append('Content-Type','application/json');
  //   let options = new RequestOptions({'headers':headers});
  //   return this._http.get('http://127.0.0.1:8000/chatroom/'+slug+'/', options)
  //           .map((response: Response) => response.json())
  //           .catch(this._errorHandler);
  // }

}
