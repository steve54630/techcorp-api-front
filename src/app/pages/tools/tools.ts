import { Component } from '@angular/core';
import { ToolsTable } from '../../components/tools-table/tools-table';
import { map, Observable } from 'rxjs';
import { IToolFilter } from '../../services/dto/tools.filter.dto';
import { ITool } from '../../types/tool';
import { ToolsService } from '../../services/tools';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-tools',
  imports: [ToolsTable, AsyncPipe],
  templateUrl: './tools.html',
  styleUrl: './tools.css',
})
export class ToolsPage {
  constructor(private toolsService: ToolsService) {}

  tools$!: Observable<ITool[]>;
  query$!: Observable<IToolFilter>;
  totalCount$!: Observable<number>;

  ngOnInit() {
    this.tools$ = this.toolsService
      .getTools()
      .pipe(map((response) => response.tools!));
    this.totalCount$ = this.toolsService
      .getTools()
      .pipe(map((response) => response.total!));
    this.query$ = this.toolsService.queryParams$;
  }

  onSortChange(filter: IToolFilter) {
    this.toolsService.updateQuery(filter);
  }

  onPageChange(filter: IToolFilter) {
    this.toolsService.updateQuery(filter);
  }
}
