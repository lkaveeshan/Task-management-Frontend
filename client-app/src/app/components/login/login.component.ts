/*import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  message: string;
  constructor(
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private validateService: ValidateService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    };
    if (!this.validateService.validateLogin(user)) {
      this.flashMessage.show("Please fill all fields", { cssClass: "alert alert-danger popup-alert" });
      return;
    }
    this.authService.authenticateUser(user).subscribe((data: any) => {
      if (data.success) {
        this.authService.storeUserData(data);
        this.router.navigate(['dashboard']);
      } else {
        this.message = data.message;
        this.flashMessage.show(this.message, { cssClass: "alert alert-danger popup-alert" });
      }
    })
  }
}*/


import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  username: string;
  password: string;
  message: string;
  private newUserSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private validateService: ValidateService,
    private router: Router,
    private webSocketService: WebSocketService
  ) { }

  ngOnInit(): void {
    this.newUserSubscription = this.webSocketService.listenForNewUsers().subscribe(username => {
        console.log(username + ' has logged in');
    });
  }

  ngOnDestroy(): void {
    this.newUserSubscription.unsubscribe();
  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    };
    if (!this.validateService.validateLogin(user)) {
      this.flashMessage.show("Please fill all fields", { cssClass: "alert alert-danger popup-alert" });
      return;
    }
    this.authService.authenticateUser(user).subscribe((data: any) => {
      if (data.success) {
        this.authService.storeUserData(data);
        this.webSocketService.login(user.username);
        this.router.navigate(['dashboard']);
      } else {
        this.message = data.message;
        this.flashMessage.show(this.message, { cssClass: "alert alert-danger popup-alert" });
      }
    })
  }
}
