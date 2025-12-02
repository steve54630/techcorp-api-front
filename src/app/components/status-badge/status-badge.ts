import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { toUppercaseFirstLetter } from '../../utils/utils';
@Component({
  selector: 'app-status-badge',
  imports: [NgClass],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})
export class StatusBadge {
  @Input() status!: string;

  statusColor!: string

  ngOnInit() {
    this.statusColor = this.getBadgeColor(this.status);
    this.status = toUppercaseFirstLetter(this.status);
  }

  getBadgeColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-emerald-500';
    case 'unused':
      return 'bg-red-500';
    case 'expiring':
      return 'bg-linear-to-r from-orange-300 to-orange-500';
    default:
      return 'gray';
  }
}
  
}

