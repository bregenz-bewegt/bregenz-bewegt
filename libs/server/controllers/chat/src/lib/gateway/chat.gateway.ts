import { Injectable } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';

@Injectable()
@WebSocketGateway({ namespace: 'chats' })
export class ChatGateway {}
