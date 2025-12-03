import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITool } from '../../types/tool';
import { LucideAngularModule } from 'lucide-angular';
import { StatusBadge } from '../status-badge/status-badge';
import { IToolFilter, Sort } from '../../services/dto/tools.filter.dto';
import { columnHeaders } from '../../types/column';

@Component({
  selector: 'app-tools-table',
  imports: [LucideAngularModule, StatusBadge],
  templateUrl: './tools-table.html',
  styleUrl: './tools-table.css',
})
export class ToolsTable {
  @Input() tools: ITool[] = [];
  @Input() query!: IToolFilter;
  @Input() resume: boolean = false;
  @Input() title!: string;
  @Input() totalCount?: number | null;

  selectColumn?: Sort;

  @Output() sortChanged = new EventEmitter<IToolFilter>();
  @Output() pageChange = new EventEmitter<IToolFilter>();

  get columns() {
    return !this.resume
      ? columnHeaders
      : columnHeaders.filter((column) => column.resume);
  }

  isLastPage(): boolean {
    return (
      this.query._page === Math.ceil((this.totalCount || 0) / this.query._limit)
    );
  }

  prevPage() {
    const newQuery = {
      ...this.query,
      _page: this.query._page - 1,
    };

    if (newQuery._page < 1) {
      newQuery._page = 1;
      return;
    }

    this.pageChange.emit(newQuery);
  }

  nextPage() {
    const newQuery = {
      ...this.query,
      _page: this.query._page + 1,
    };

    this.pageChange.emit(newQuery);
  }

  updateQuery(column: Sort) {
    this.selectColumn = column;

    const currentParams = this.query;

    let newDirection: 'asc' | 'desc';

    if (currentParams._sort === column) {
      newDirection = currentParams._order === 'asc' ? 'desc' : 'asc';
    } else {
      newDirection = 'asc';
    }

    const newFilter = {
      ...currentParams,
      _sort: column,
      _order: newDirection,
      _page: 1,
    };

    this.sortChanged.emit(newFilter);
  }

  ngOnDestroy() {
    const newQuery: IToolFilter = {
      _page: 1,
      _limit: 10,
      _sort: Sort.ID,
      _order: 'asc',
    };

    this.sortChanged.emit(newQuery);
  }
}
