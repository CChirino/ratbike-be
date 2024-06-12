import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, any>();

  constructor(private jwtService: JwtService) {}

  handleConnection(client: Socket) {
    const token = client.handshake.query.token as string;
    if (token) {
      try {
        const user = this.jwtService.verify(token);
        this.connectedUsers.set(client.id, user);
        console.log('New client connected', client.id, user);

        // Emit the number of connected users to all clients
        this.emitConnectedUsersCount();
      } catch (error) {
        console.log('Invalid token', token);
        client.disconnect();
      }
    } else {
      console.log('No token provided');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
    this.connectedUsers.delete(client.id);

    // Emit the number of connected users to all clients
    this.emitConnectedUsersCount();
  }

  @SubscribeMessage('mensaje')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    console.log(data);
    this.server.emit('mensaje', data);
  }

  @SubscribeMessage('connectedUsers')
  handleConnectedUsers(@ConnectedSocket() client: Socket) {
    const users = Array.from(this.connectedUsers.values());
    client.emit('connectedUsers', users);
  }

  @SubscribeMessage('connectedUsersCount')
  handleConnectedUsersCount(@ConnectedSocket() client: Socket) {
    const count = this.connectedUsers.size;
    client.emit('connectedUsersCount', count);
  }

  private emitConnectedUsersCount() {
    const count = this.connectedUsers.size;
    this.server.emit('connectedUsersCount', count);
  }
}
