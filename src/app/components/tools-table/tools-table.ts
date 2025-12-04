import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITool } from '../../types/tool';
import { LucideAngularModule } from 'lucide-angular';
import { StatusBadge } from '../status-badge/status-badge';
import { IToolFilter, Sort } from '../../services/dto/tools.filter.dto';
import { columnHeaders } from '../../types/column';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolCard } from "../tool-card/tool-card";

@Component({
  selector: 'app-tools-table',
  imports: [LucideAngularModule, StatusBadge, DatePipe, FormsModule, ToolCard],
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
  @Output() pageChange = new EventEmitter<'prev' | 'next'>();

  get columns() {
    return !this.resume
      ? columnHeaders
      : columnHeaders.filter((column) => column.resume);
  }

  isLastPage(): boolean {
    return (
      this.query._page ===
      Math.ceil((this.totalCount || 0) / this.query._limit!)
    );
  }

  prevPage() {
    if (this.pageChange) this.pageChange.emit('prev');
  }

  nextPage() {
    if (this.pageChange) this.pageChange.emit('next');
  }

  handleSortChange($event: Event) {
    const target = $event.target as HTMLSelectElement;

    if (target.value) {
      this.updateQuery(target.value as Sort);
    }
  }

  updateQuery(column: Sort, page?: number) {
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
      _page: page,
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
