import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTaskComponent } from './add-task.component';
import { TasksService } from '../../services/tasks.service';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';

describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;
  let tasksService: TasksService;
  let spy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTaskComponent],
      providers: [
        TasksService,
        FormBuilder
      ]
    });

    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    tasksService = TestBed.get(TasksService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call saveTask on TasksService when form is submitted', () => {
    spy = spyOn(tasksService, 'saveTask').and.returnValue(of({ success: true, task: { title: 'Test Task' } }));
    component.title = 'Test Task';
    component.onFormSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit taskAdded event when a task is saved', () => {
    spyOn(component.taskAdded, 'emit');
    component.taskSaved({ title: 'Test Task' });
    expect(component.taskAdded.emit).toHaveBeenCalledWith({ title: 'Test Task' });
  });

  it('should toggle more settings when toggleMoreSettings is called', () => {
    component.showMoreSettings = false;
    component.toggleMoreSettings({ preventDefault: () => {} });
    expect(component.showMoreSettings).toBe(true);
  });

  it('should close more settings when closeMoreSettings is called', () => {
    component.showMoreSettings = true;
    component.closeMoreSettings();
    expect(component.showMoreSettings).toBe(false);
  });
});
