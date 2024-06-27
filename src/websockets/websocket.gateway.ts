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
import { Injectable } from '@nestjs/common';
import { SessionsService } from 'src/sessions/sessions.service';
import { response } from 'express';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
    methods: '*',
    allowRequest: '*'
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private sessionsService: SessionsService) {}

  handleConnection(client: Socket) {
    const token = client.handshake.query.token as string;
    if (token) {
      try {
        console.log('New client connected');
        // Emit the number of connected users to all clients
        this.emitConnectedUsers();
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
    // Emit the number of connected users to all clients
    this.emitConnectedUsers();
  }

  @SubscribeMessage('mensaje')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    console.log(data);
    this.server.emit('mensaje', data);
  }

  @SubscribeMessage('connectedUsers')
  async handleConnectedUsers(@ConnectedSocket() client: Socket) {
    const connectedUsers = await this.sessionsService.findAll();
    client.emit('connectedUsers', connectedUsers);
  }

  private async emitConnectedUsers() {
    const connectedUsers = await this.sessionsService.findAll();

    this.server.emit('connectedUsers', connectedUsers);
  }
}
