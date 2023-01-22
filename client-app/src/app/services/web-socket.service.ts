import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  // Send a 'login' event
  login(username: string) {
    this.socket.emit('login', username);
  }

  // Send a 'logout' event
  logout() {
    this.socket.emit('logout');
  }

  // Listen for a 'new user' event
  listenForNewUsers(): Observable<string> {
    return new Observable((subscriber) => {
      this.socket.on('new user', (username: string) => {
        subscriber.next(username);
      });
    });
  }

  // Listen for a 'user left' event
  listenForLeftUsers(): Observable<string> {
    return new Observable((subscriber) => {
      this.socket.on('user left', (username: string) => {
        subscriber.next(username);
      });
    });
  }
}
