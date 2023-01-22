import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskSettingsComponent } from './task-settings.component';
import { TasksService } from '../../services/tasks.service';
import { of } from 'rxjs';
import * as moment from 'moment';

describe('TaskSettingsComponent', () => {
  let component: TaskSettingsComponent;
  let fixture: ComponentFixture<TaskSettingsComponent>;
  let taskService: TasksService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskSettingsComponent ],
      providers: [ TasksService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSettingsComponent);
    component = fixture.componentInstance;
    taskService = TestBed.get(TasksService);
    spyOn(taskService, 'saveTask').and.returnValue(of({ success: true, task: { _id: '123', title: 'Test task', description: 'Test description', status: 'In Progress', labels: {}, dueDate: '' } }));
    component.settings = { _id: '123', title: 'Test task', description: 'Test description', status: 'In Progress', labels: {} };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the saveTask method of the task service when the save button is clicked', () => {
    component.saveTask();
    expect(taskService.saveTask).toHaveBeenCalled();
  });

  it('should emit an event when the save button is clicked and the task is saved successfully', () => {
    spyOn(component.edited, 'emit');
    component.saveTask();
    expect(component.edited.emit).toHaveBeenCalledWith({ _id: '123', title: 'Test task', description: 'Test description', status: 'In Progress', labels: {}, dueDate: '', oldStatus: 'In Progress' });
  });

  it('should add label when add label is clicked', () => {
    component.addLabel(['Test Label', 'info']);
    expect(component.labels).toEqual({'Test Label': 'info'});
  });

  it('should remove label when remove label is clicked', () => {
    component.labels = {'Test Label': 'info'};
    component.removeLabel('Test Label');
    expect(component.labels).toEqual({});
  });

  it('should add custom label when add custom label is clicked', () => {
    component.customLabel = 'Test Label';
    component.addCustomLabel();
    expect(component.labels).toEqual({'Test Label': 'success'});
  });

  it('should set the due date when date is selected', () => {
    const date = moment();
    component.onDueDateChange(date);
    expect(component.dueDate).toEqual(date.format('YYYY-MM-DD'));
  });

  it('should open the label add form when toggleLabelAddForm is called', () => {
    component.toggleLabelAddForm();
    expect(component.labelAddFormOpen).toBeTruthy();
  });

  it('should close the label add form when toggleLabelAddForm is called and the form is open', () => {
    component.labelAddFormOpen = true;
    component.toggleLabelAddForm();
    expect(component.labelAddFormOpen).toBeFalsy();
  });

  it('should reset the custom label when toggleLabelAddForm is called and the form is closed', () => {
    component.customLabel = 'Test Label';
    component.toggleLabelAddForm();
    expect(component.customLabel).toEqual('');
  });
});
