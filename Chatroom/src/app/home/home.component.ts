import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ChatroomService } from './chatroom.service';
import { Chatroom } from '.././_models/chatroom';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers : [ ChatroomService ]
})
export class HomeComponent implements OnInit, OnDestroy {
  public user;
  public chatrooms : Chatroom[] = [];
  selectedslug : string;
  chatRoomForm : FormGroup;
  chatroomSub : any;
  timesub : any;


  constructor(private _router : Router,
              private _route : ActivatedRoute,
              private _formBuilder : FormBuilder,
              private _chat: ChatroomService) { }

  ngOnInit() {
    //this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.chatRoomForm = this._formBuilder.group({
      name : ["",[ Validators.required, Validators.minLength(6), Validators.maxLength(120)]]
    });
    this._route.params.subscribe((params : Params) => {
                                        let slug = params['slug'];
                                        this.selectedslug = slug;
                                });
    this.getChatrooms();
}

getChatrooms(){
    this.chatroomSub = this._chat.getChatrooms()
                .subscribe(chatrooms => {
                  this.chatrooms = chatrooms;
                  this.timeSubscribe();
                });
}

newChatroom(){
    let created = this._chat.newChatroom(this.chatRoomForm.value.name);
    if(created){
      alert("Chatroom Created");
      this.chatRoomForm.reset();
    }else{
      alert("Problem creating chatroom");
    }
  }

timeSubscribe(){
  this.timesub = Observable.timer(4000).first().subscribe(() => {this.getChatrooms()});
}
ngOnDestroy(){
  this.timesub.unsubscribe();
  this.chatroomSub.unsubscribe();
}

  onSelect(slug:string){
    this._router.navigate(['/chat',slug]);

  }
  isSelected(slug){
    return this.selectedslug == slug;
  }

}
