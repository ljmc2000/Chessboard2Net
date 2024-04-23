import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplayBrowserComponent } from './replay-browser.component';

describe('ReplayBrowserComponent', () => {
  let component: ReplayBrowserComponent;
  let fixture: ComponentFixture<ReplayBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplayBrowserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReplayBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
