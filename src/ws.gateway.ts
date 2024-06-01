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
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private connectedUsers: Map<string, string> = new Map();

  async handleConnection(client: Socket) {
    const token = client.handshake.query.token as string;
    if (token) {
      try {
        const payload = jwt.verify(token, 'your-jwt-secret') as {
          userId: string;
        };
        this.connectedUsers.set(payload.userId, client.id);
        this.server.emit('users', Array.from(this.connectedUsers.keys()));
      } catch (e) {
        client.disconnect();
      }
    } else {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const token = client.handshake.query.token as string;
    if (token) {
      try {
        const payload = jwt.verify(token, 'your-jwt-secret') as {
          userId: string;
        };
        this.connectedUsers.delete(payload.userId);
        this.server.emit('users', Array.from(this.connectedUsers.keys()));
      } catch (e) {
        // Do nothing
      }
    }
  }

  @SubscribeMessage('getUsers')
  handleGetUsers(@ConnectedSocket() client: Socket): void {
    client.emit('users', Array.from(this.connectedUsers.keys()));
  }
}
