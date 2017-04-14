export interface ChatMessage{
    count : number;
    next : string;
    previous : string;
    results : Message[];

}

export class Message{
    message : string;
    sender : string;
    timestamp : string;
}