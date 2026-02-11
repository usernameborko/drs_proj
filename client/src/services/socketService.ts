import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, { transports: ["polling"], withCredentials: false });
    }
    return this.socket;
  }

  onNewQuiz(callback: (data: any) => void) {
    if (!this.socket) this.connect();
    this.socket!.on("new_quiz_created", callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();