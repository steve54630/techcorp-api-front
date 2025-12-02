import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsTable } from './tools-table';

describe('ToolsTable', () => {
  let component: ToolsTable;
  let fixture: ComponentFixture<ToolsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
