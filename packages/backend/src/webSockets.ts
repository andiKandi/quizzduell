import { v4 as uuidv4 } from 'uuid';
// tslint:disable-next-line:no-var-requires
const { Server } = require('socket.io');

export class WebSocketManager {
  private io: any;
  private clients: Map<string, string> = new Map();

  constructor(server: any) {
    this.io = new Server(server);
  }

  public initSocket() {
    this.io.on('connection', (socket: any) => {
      this.onUserSignin(socket);

      this.onUserLogout(socket);

      this.onMatchFound(socket);

      this.onAddOrDeleteFriend(socket);

      this.onUpdateStats(socket);

      this.onSendMessage(socket);

      this.onIsUserOnline(socket);

      this.onNewGame(socket);

      this.onGameEvent(socket);
    });
  }

  private onUserSignin(socket: any) {
    socket.on('signIn', (data: any) => {
      const playerId = data;
      const clientSocketId = socket.id;

      this.clients.set(playerId, clientSocketId);

      this.io.to(socket.id).emit('server', `id: ${playerId}`);
    });
  }

  private onUserLogout(socket: any) {
    socket.on('remove_id', (data: any) => {
      this.clients.delete(data);
    });
  }

  private onMatchFound(socket: any) {
    socket.on('match_making_found', (data: any) => {
      const opponentSocketId = this.clients.get(data.opponentId);
      this.io.to(opponentSocketId).emit('match_making_close');
    });
  }

  private onAddOrDeleteFriend(socket: any) {
    socket.on('addOrDeleteFriend', (friendId: string) => {
      this.io.to(this.clients.get(friendId)).emit('addOrDeleteFriend');
    });
  }

  private onUpdateStats(socket: any) {
    socket.on('updateStats', (playerId: string) => {
      this.io.to(this.clients.get(playerId)).emit('updateStats');
    });
  }

  private onSendMessage(socket: any) {
    socket.on('send_message', (data: any) => {
      const fromPlayer = data.fromPlayer;
      const toPlayer = data.toPlayer;
      const message = data.message;
      const toPlayerSocketId = this.clients.get(toPlayer);

      this.io.to(toPlayerSocketId).emit('new_message', {
        fromPlayerId: fromPlayer,
        id: uuidv4(),
        message,
      });
    });
  }

  private onIsUserOnline(socket: any) {
    socket.on('is_user_online', (data: any) => {
      const playerId = data;
      if (this.clients.has(playerId)) {
        this.io.to(socket.id).emit('user_is_online', { online: true });
      } else {
        this.io.to(socket.id).emit('user_is_online', { online: false });
      }
    });
  }

  private onNewGame(socket: any) {
    socket.on('newGame', (data: any) => {
      const playerSocketId = this.clients.get(data.creatorId);
      const opponentSocketId = this.clients.get(data.opponentId);

      this.io.to(playerSocketId).emit('gameEvent');
      this.io.to(opponentSocketId).emit('gameEvent');
    });
  }

  private onGameEvent(socket: any) {
    socket.on('gameEvent', async (data: any) => {
      const creatorId = data.creatorId;
      const opponentId = data.opponentId;

      const playerSocketId = this.clients.get(creatorId);
      const opponentSocketId = this.clients.get(opponentId);
      this.io.to(playerSocketId).emit('gameEvent');
      this.io.to(opponentSocketId).emit('gameEvent');
      this.io.to(playerSocketId).emit('updateStats');
      this.io.to(opponentSocketId).emit('updateStats');
    });
  }
}
