import { Component, Input } from '@angular/core';
import { StatusBadge } from '../status-badge/status-badge';
import { DatePipe } from '@angular/common';
import { ITool } from '../../types/tool';

@Component({
  selector: 'app-tool-card',
  imports: [StatusBadge, DatePipe],
  templateUrl: './tool-card.html',
  styleUrl: './tool-card.css',
})
export class ToolCard {
  @Input() tool!: ITool;
  @Input() resume: boolean = false;
}
