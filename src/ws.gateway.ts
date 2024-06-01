// ws.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { WsJwtAuthGuard } from './ws-jwt-auth.guard';

@WebSocketGateway({
  cors: {
    origin: '*', // Ajusta esto para permitir el CORS desde tu frontend
  },
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private connectedUsers: Map<string, string> = new Map();

  constructor(private readonly jwtService: JwtService) {}

  @UseGuards(WsJwtAuthGuard)
  async handleConnection(client: Socket) {
    const user = client.handshake.query.user;
    if (user) {
      this.connectedUsers.set(user.userId, client.id);
      this.server.emit('users', Array.from(this.connectedUsers.keys()));
    }
  }

  @UseGuards(WsJwtAuthGuard)
  handleDisconnect(client: Socket) {
    const user = client.handshake.query.user;
    if (user) {
      this.connectedUsers.delete(user.userId);
      this.server.emit('users', Array.from(this.connectedUsers.keys()));
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('getUsers')
  handleGetUsers(@ConnectedSocket() client: Socket): void {
    client.emit('users', Array.from(this.connectedUsers.keys()));
  }
}
