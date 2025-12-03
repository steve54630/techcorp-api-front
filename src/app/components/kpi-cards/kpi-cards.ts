import { Component, Input } from '@angular/core';
import { absoluteValue } from '../../utils/utils';
import { LucideAngularModule } from "lucide-angular";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-kpi-cards',
  imports: [LucideAngularModule, NgClass],
  templateUrl: './kpi-cards.html',
  styleUrl: './kpi-cards.css',
})
export class KpiCards {

  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() unit: string = '';
  @Input() target? : number
  @Input() trend: string = '';
  @Input() class!: string;

  color: string = '';
  icon: string = '';
  absoluteValue : number = 0

  ngOnInit() {
    this.icon = this.getIcon(this.title);
    this.color = this.getTargetColor();
    this.absoluteValue = absoluteValue(this.trend);
  }

  getTargetColor(): string {
    
    const change = this.trend.charAt(0);
    const trendDirection : boolean = change === '+' ? true : false;

    switch (trendDirection) {
      case true:
        return this.absoluteValue >= 10 ? 'bg-blue-500' : 'bg-green-500';
      case false:
        return this.absoluteValue >= 10 ? 'bg-pink-500' : 'bg-red-500';
    }
  }

  getIcon(title: string): string {
    switch (title) {
      case 'Budget':
        return 'trending-up';
      case 'Tools':
        return 'wrench';
      case 'Departments':
        return 'building-2';
      case 'Cost per user':
        return 'users';
      default:
        return '';
    }
  }

}
