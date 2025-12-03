import { Component } from '@angular/core';
import { ToolsTable } from '../../components/tools-table/tools-table';
import { DataService } from '../../services/data';
import { map, Observable, Subscription } from 'rxjs';
import { extractKpiData, Kpi } from '../../utils/kpi';
import { KpiCards } from '../../components/kpi-cards/kpi-cards';
import { ToolsService } from '../../services/tools';
import { ITool } from '../../types/tool';
import { IToolFilter } from '../../services/dto/tools.filter.dto';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [ToolsTable, KpiCards, AsyncPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  constructor(
    private dataService: DataService,
    protected toolsService: ToolsService
  ) {}

  kpiData$!: Observable<Kpi[]>;
  tools$!: Observable<ITool[]>;
  query$!: Observable<IToolFilter>;

  ngOnInit() {
    this.kpiData$ = this.dataService
      .getAnalytics()
      .pipe(map((analytics) => extractKpiData(analytics)));

    this.tools$ = this.toolsService
      .getTools()
      .pipe(map((response) => response.tools!));
    this.query$ = this.toolsService.queryParams$;
  }

  onSortChange(filter: IToolFilter) {
    this.toolsService.updateQuery(filter);
  }

  onPageChange(filter: IToolFilter) {
    this.toolsService.updateQuery(filter);
  }
}
