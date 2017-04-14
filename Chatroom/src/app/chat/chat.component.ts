import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from './chat.service';
import { ChatMessage } from '.././_models/chatmessage';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { RoomMember } from '.././_models/roommember';
import { User } from '.././_models/user'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService],
})
export class ChatComponent implements OnInit, OnDestroy {

  user : User;
  chatMessage : ChatMessage;
  slug : string;
  members : RoomMember[] = [];
  membersSubscription : any;
  messageSubscription : any;
  timerSubscription : any;
  messageForm : FormGroup;
  newMemberForm : FormGroup;
  suggestedUsers = [];


  constructor(private _chat:ChatService,
              private _route : ActivatedRoute, 
              private _formBuilder : FormBuilder,
              private _router : Router) {}

  ngOnInit() {
    this._route.params.subscribe((params : Params) => {
          let slug = (params['slug']);
          this.slug = slug;
      });
      
      this.messageForm = this._formBuilder.group({
        message : ["",[Validators.required]]
      });
      
      this.newMemberForm = this._formBuilder.group({
        username : ["",[Validators.required]]
      });

      this.user = JSON.parse(localStorage.getItem("currentUser"));

      this.refreshData();
      
  }

  sendMessage(){

    this._chat.newMessage(this.slug, this.messageForm.value.message)
          .then(res =>{
            if(!res){
                alert("Problem sending message");
            }else{
              this.messageForm.reset();
            }
          })
  }

  addMember(){

    this._chat.newMember(this.slug,this.newMemberForm.value.username)
        .then(res => {
          if(!res){
            alert("Problem Adding user");
          }else{
            this.newMemberForm.reset();
          }
        });
  }

  exitChatroom(){
    this._chat.exitChatrom(this.slug)
      .then(res => {
          if(res){
            alert("Exited from chatroom");
            this._router.navigate(['/home']);
          }else{
            alert("Problem exiting... !");
          }

      });
  }

  userSuggestions(){
    let searchstring=this.newMemberForm.value.username;
    if(searchstring=="" || searchstring.length<3){
      this.suggestedUsers = [];
    }else {
      this._chat.getUserSuggestions(searchstring)
        .then(response =>{
            this.suggestedUsers = response;
        });
    }
  }

  newMemBySuggestion(user){
      this._chat.newMember(this.slug,user.username)
        .then(res => {
          if(!res){
            alert("Problem Adding user");
          }else{
            alert(user.fullname+" added to chatroom");
            this.newMemberForm.reset();
            this.suggestedUsers = [];
          }
        });
  }

  isMyMessage(sendername:string){
    return this.user.fullname == sendername;
  }

  ngOnDestroy(){
    this.messageSubscription.unsubscribe();
    this.timerSubscription.unsubscribe();
    this.membersSubscription.unsubscribe();
  }

  private refreshData(): void {
    this.messageSubscription = this._chat.getMessages(this.slug)
              .subscribe(chatMessage => {
                this.chatMessage = chatMessage;
                //console.log("ChatMessages : \n"+JSON.stringify(chatMessage));
              });

    this.membersSubscription =  this._chat.getMembers(this.slug)
                                .subscribe(members => {
                                this.members = members;
                                this.subscribeToData();
              });

    
  }

  subscribeToData(){
    this.timerSubscription = Observable.timer(3000).first().subscribe(() => this.refreshData());
  }

  goBack(){
    let selected_slug = this.slug ? this.slug : null;
    this._router.navigate(['/home',{slug : selected_slug}]);
  }
  

}
