import { Component } from '@angular/core';
import { ITool } from '../../types/tool';
import { ToolsService } from '../../services/tools';
import { Subscription } from 'rxjs';
import { LucideAngularModule } from "lucide-angular";
import { StatusBadge } from "../status-badge/status-badge";

@Component({
  selector: 'app-tools-table',
  imports: [LucideAngularModule, StatusBadge],
  templateUrl: './tools-table.html',
  styleUrl: './tools-table.css',
})
export class ToolsTable {
  tools: ITool[] = [];
  subscription!: Subscription;

  constructor(private toolsService: ToolsService) {}

  ngOnInit() {
    this.subscription = this.toolsService.getTools({}).subscribe((tools) => {
      this.tools = tools;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
