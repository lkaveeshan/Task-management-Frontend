import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailsComponent } from './task-details.component';
import { TasksService } from '../../services/tasks.service';
import { of } from 'rxjs';

describe('TaskDetailsComponent', () => {
  let component: TaskDetailsComponent;
  let fixture: ComponentFixture<TaskDetailsComponent>;
  let taskService: TasksService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskDetailsComponent ],
      providers: [ TasksService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailsComponent);
    component = fixture.componentInstance;
    taskService = TestBed.get(TasksService);
    spyOn(taskService, 'saveTask').and.returnValue(of({ success: true, task: { _id: '123', title: 'Test task', description: 'Test description', status: 'In Progress', labels: {} } }));
    component.task = { _id: '123', title: 'Test task', description: 'Test description', status: 'In Progress', labels: {} };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the saveTask method of the task service when the save button is clicked', () => {
    component.onEditSave();
    expect(taskService.saveTask).toHaveBeenCalled();
  });

  it('should emit an event when the save button is clicked and the task is saved successfully', () => {
    spyOn(component.edited, 'emit');
    component.onEditSave();
    expect(component.edited.emit).toHaveBeenCalledWith({ _id: '123', title: 'Test task', description: 'Test description', status: 'In Progress', labels: {}, oldStatus: 'In Progress' });
  });
});
