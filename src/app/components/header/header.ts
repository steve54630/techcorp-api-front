import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { icons, LucideAngularModule, Zap } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LucideAngularModule, RouterLink, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  isMobileMenuOpen = false;
  
  buttons = [
    { name: 'Dashboard', link: '/' },
    { name: 'Tools', link: '/tools' },
    { name: 'Analytics', link: '/analytics' },
    { name: 'Settings', link: '/settings' },
  ];

  // 2. Méthode pour basculer l'état
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // 3. (Optionnel) Méthode pour fermer le menu
  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  options = [
    { name: 'night', icon: 'moon' },
    { name: 'notifications', icon: 'bell' },
    { name: 'settings', icon: 'settings' },
  ];
}
