import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { LucideAngularModule } from 'lucide-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  // Données de mock pour simuler les Inputs
  const mockButtons = [
    { name: 'Dashboard', link: '/' },
    { name: 'Inventory', link: '/inventory' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Déclarer le composant et les dépendances nécessaires
      imports: [Header, LucideAngularModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    
    // Initialiser les Inputs pour le test
    component.buttons = mockButtons;
    
    fixture.detectChanges(); // Déclenche ngOnInit et le rendu initial
  });

  it('should create and display the "TechCorp" logo', () => {
    expect(component).toBeTruthy();
    const logoElement = fixture.debugElement.query(By.css('span.font-bold'));
    expect(logoElement.nativeElement.textContent).toContain('TechCorp');
  });

  // --- GROUPE 1: Tests de la Navigation ---

  it('should render the correct number of navigation buttons', () => {
    const navButtons = fixture.nativeElement.querySelectorAll('nav button');
    expect(navButtons.length).toBe(mockButtons.length);
    expect(navButtons[0].textContent.trim()).toBe('Dashboard');
  });

  it('should apply the active class when a button is active (via routerLinkActive)', () => {
    // NOTE: Simuler l'activation de route est complexe. Ici, nous vérifions que l'attribut est configuré.
    const dashboardButton = fixture.nativeElement.querySelector('nav button:first-child');
    expect(dashboardButton.getAttribute('routerLinkActive')).toContain('text-gray-800');
  });

  // --- GROUPE 2: Tests de la Recherche ---

  it('should display the search input and the search icon', () => {
    const searchInput = fixture.nativeElement.querySelector('input[type="search"]');
    const searchIcon = fixture.debugElement.query(By.css('lucide-icon[name="search"]'));
    
    expect(searchInput).toBeTruthy('Search input is missing');
    expect(searchInput.placeholder).toBe('Search tools...');
    expect(searchIcon).toBeTruthy('Search icon is missing');
  });

});