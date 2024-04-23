import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplayViewerComponent } from './replay-viewer.component';

describe('ReplayViewerComponent', () => {
  let component: ReplayViewerComponent;
  let fixture: ComponentFixture<ReplayViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplayViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReplayViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
