import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let validateService: ValidateService;
  let flashMessage: FlashMessagesService;
  let router: Router;
  let spy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        AuthService,
        ValidateService,
        FlashMessagesService,
        Router
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.get(AuthService);
    validateService = TestBed.get(ValidateService);
    flashMessage = TestBed.get(FlashMessagesService);
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call validateLogin on ValidateService when form is submitted', () => {
    spy = spyOn(validateService, 'validateLogin').and.returnValue(true);
    component.username = 'test';
    component.password = 'test';
    component.onLoginSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call authenticateUser on AuthService when form is submitted and fields are valid', () => {
    spyOn(validateService, 'validateLogin').and.returnValue(true);
    spy = spyOn(authService, 'authenticateUser').and.returnValue(of({ success: true, token: 'test', user: { username: 'test' } }));
    component.username = 'test';
    component.password = 'test';
    component.onLoginSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call storeUserData on AuthService when user is authenticated', () => {
    spyOn(validateService, 'validateLogin').and.returnValue(true);
    spyOn(authService, 'authenticateUser').and.returnValue(of({ success: true, token: 'test', user: { username: 'test' } }));
    spy = spyOn(authService, 'storeUserData');
    component.username = 'test';
    component.password = 'test';
    component.onLoginSubmit();
    expect(spy).toHaveBeenCalled();
  });

    it('should navigate to dashboard when user is authenticated', () => {
    spyOn(validateService, 'validateLogin').and.returnValue(true);
    spyOn(authService, 'authenticateUser').and.returnValue(of({ success: true, token: 'test', user: { username: 'test' } }));
    spyOn(authService, 'storeUserData');
    spy = spyOn(router, 'navigate');
    component.username = 'test';
    component.password = 'test';
    component.onLoginSubmit();
    expect(spy).toHaveBeenCalledWith(['dashboard']);
  });

  it('should show flash message when fields are not valid', () => {
    spyOn(validateService, 'validateLogin').and.returnValue(false);
    spy = spyOn(flashMessage, 'show');
    component.onLoginSubmit();
    expect(spy).toHaveBeenCalledWith("Please fill all fields", { cssClass: "alert alert-danger popup-alert" });
  });

  it('should show flash message when user is not authenticated', () => {
    spyOn(validateService, 'validateLogin').and.returnValue(true);
    spyOn(authService, 'authenticateUser').and.returnValue(of({ success: false, message: 'Test message' }));
    spy = spyOn(flashMessage, 'show');
    component.username = 'test';
    component.password = 'test';
    component.onLoginSubmit();
    expect(spy).toHaveBeenCalledWith('Test message', { cssClass: "alert alert-danger popup-alert" });
  });
});

