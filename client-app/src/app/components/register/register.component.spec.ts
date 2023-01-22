import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let validateService: ValidateService;
  let flashMessage: FlashMessagesService;
  let router: Router;
  let spy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        AuthService,
        ValidateService,
        FlashMessagesService,
        Router
      ]
    });

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.get(AuthService);
    validateService = TestBed.get(ValidateService);
    flashMessage = TestBed.get(FlashMessagesService);
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call validateRegister on ValidateService when form is submitted', () => {
    spy = spyOn(validateService, 'validateRegister').and.returnValue(true);
    component.name = 'test';
    component.username = 'test';
    component.email = 'test@test.com';
    component.password = 'test';
        component.onRegisterSubmit();
    expect(spy).toHaveBeenCalledWith({
      name: 'test',
      username: 'test',
      email: 'test@test.com',
      password: 'test'
    });
  });

  it('should call validateEmail on ValidateService when form is submitted', () => {
    spyOn(validateService, 'validateRegister').and.returnValue(true);
    spy = spyOn(validateService, 'validateEmail').and.returnValue(true);
    component.name = 'test';
    component.username = 'test';
    component.email = 'test@test.com';
    component.password = 'test';
    component.onRegisterSubmit();
    expect(spy).toHaveBeenCalledWith('test@test.com');
  });

  it('should show flash message when fields are not valid', () => {
    spyOn(validateService, 'validateRegister').and.returnValue(false);
    spy = spyOn(flashMessage, 'show');
    component.onRegisterSubmit();
    expect(spy).toHaveBeenCalledWith("Please fill all required fields", { cssClass: "alert alert-danger popup-alert" });
  });

  it('should show flash message when email is not valid', () => {
    spyOn(validateService, 'validateRegister').and.returnValue(true);
    spyOn(validateService, 'validateEmail').and.returnValue(false);
    spy = spyOn(flashMessage, 'show');
    component.onRegisterSubmit();
    expect(spy).toHaveBeenCalledWith("Please enter a valid email", { cssClass: "alert alert-danger popup-alert" });
  });

  it('should show flash message and navigate to login when user is registered successfully', () => {
    spyOn(validateService, 'validateRegister').and.returnValue(true);
    spyOn(validateService, 'validateEmail').and.returnValue(true);
    spyOn(authService, 'registerUser').and.returnValue(of({ status: 'success', message: 'Test message' }));
    spy = spyOn(flashMessage, 'show');
    spyOn(router, 'navigate');
    component.name = 'test';
    component.username = 'test';
    component.email = 'test@test.com';
    component.password = 'test';
    component.onRegisterSubmit();
    expect(spy).toHaveBeenCalledWith('Test message', { cssClass: "alert popup-alert alert-success" });
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show flash message and set error message when user registration fails', () => {
    spyOn(validateService, 'validateRegister').and.returnValue(true);
    spyOn(validateService, 'validateEmail').and.returnValue(true);
    spyOn(authService, 'registerUser').and.returnValue(of({ status: 'error', message: 'Test message' }));
    spyOn(flashMessage, 'show');
    spyOn(router, 'navigate');
    component.name = 'test';
    component.username = 'test';
    component.email = 'test@test.com';
    component.password = 'test';
    component.onRegisterSubmit();
    expect(spy).toHaveBeenCalledWith('Test message', { cssClass: "alert popup-alert alert-danger" });
    expect(component.errors.submit).toEqual('Test message');
    expect(router.navigate).toHaveBeenCalledWith(['/register']);
  });

});

