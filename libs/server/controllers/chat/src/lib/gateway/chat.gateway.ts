import { Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  ChatServerToClientEvents,
  ChatClientToServerEvents,
  ChatInterServerEvents,
  CreateMessageDto,
  JwtPayloadWithRefreshToken,
} from '@bregenz-bewegt/shared/types';
import {
  WsAccessTokenGuard,
  WsGetCurrentUser,
} from '@bregenz-bewegt/server/common';
import { User } from '@prisma/client';
import { ChatService } from '../chat.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UtilService } from '@bregenz-bewegt/server/util';
import { PrismaService } from '@bregenz-bewegt/server-prisma';

@Injectable()
@WebSocketGateway({ namespace: 'chats', cors: { origin: true } })
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private utilService: UtilService,
    private prismaService: PrismaService
  ) {}

  @WebSocketServer()
  private server: Server = new Server<
    ChatServerToClientEvents,
    ChatClientToServerEvents,
    ChatInterServerEvents
  >();

  async handleConnection(socket: Socket): Promise<any> {
    const token = this.utilService.extractBearerToken(
      socket.handshake.auth.authorization
    );

    try {
      const decoded: JwtPayloadWithRefreshToken = this.jwtService.verify(
        token,
        { secret: this.configService.get('NX_JWT_ACCESS_TOKEN_SECRET') }
      );

      const user = await this.prismaService.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user) {
        socket.emit('error', new UnauthorizedException());
        return socket.disconnect();
      }

      this.prismaService.user.update({
        where: { id: user.id },
        data: { conversationSocketId: socket.id },
      });
    } catch {
      return socket.disconnect();
    }
  }

  @UseGuards(WsAccessTokenGuard)
  @SubscribeMessage('message.create')
  async createMessage(
    @WsGetCurrentUser('sub') userId: User['id'],
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket()
    socket: Socket
  ): Promise<CreateMessageDto> {
    const conversation = await this.chatService.createMessage(userId, dto);
    console.log(conversation.participants);

    conversation.participants.forEach((partifipant) => {
      socket.to(partifipant.conversationSocketId).emit('onCreateMessage', dto);
    });

    return dto;
  }
}
