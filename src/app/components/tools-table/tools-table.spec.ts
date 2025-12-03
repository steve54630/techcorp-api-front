import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsTable } from './tools-table';
import { IToolFilter, Sort } from '../../services/dto/tools.filter.dto';

describe('ToolsTable', () => {
  let component: ToolsTable;
  let fixture: ComponentFixture<ToolsTable>;

  // Constantes pour les tests de pagination
  const TOTAL_COUNT = 24;
  const PAGE_LIMIT = 10;
  const DEFAULT_QUERY: IToolFilter = {
    _page: 1,
    _limit: PAGE_LIMIT,
    _sort: Sort.ID,
    _order: 'asc',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolsTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolsTable);
    component = fixture.componentInstance;

    // Initialisation des inputs pour la plupart des tests
    component.query = { ...DEFAULT_QUERY };
    component.totalCount = TOTAL_COUNT;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // --- GROUPE 1: Tests de l'Affichage Conditionnel (Input 'resume') ---

  it('should display the full set of columns when resume is FALSE (Detailed View)', () => {
    component.resume = false;
    fixture.detectChanges();

    const columnHeaders = fixture.nativeElement.querySelectorAll('th');
    // Vérifiez le nombre total de TH (doit correspondre à columnHeaders.length dans votre fichier)
    expect(columnHeaders.length).toBe(7);

    // Vérifier spécifiquement la présence d'une colonne détaillée (ex: 'Category')
    const tableText = fixture.nativeElement.textContent;
    expect(tableText).toContain('Category');
  });

  it('should display only the summary columns when resume is TRUE (Dashboard View)', () => {
    component.resume = true;
    fixture.detectChanges();

    const columnHeaders = fixture.nativeElement.querySelectorAll('th');
    // Vérifiez le nombre de colonnes en mode résumé
    expect(columnHeaders.length).toBe(5);

    // Vérifier spécifiquement l'absence d'une colonne détaillée
    const tableText = fixture.nativeElement.textContent;
    expect(tableText).not.toContain('Category');
  });

  // --- GROUPE 2: Tests des Événements de Tri (Output 'sortChanged') ---

  it('should emit sortChanged event with new ASC order on first click of a new column', () => {
    spyOn(component.sortChanged, 'emit');

    // Définir l'état initial: Tri actif sur NAME
    component.query = { ...DEFAULT_QUERY, _sort: Sort.NAME, _order: 'asc' };
    fixture.detectChanges();

    // 1. Trouver l'en-tête de colonne 'DEPARTMENT' et cliquer dessus
    // NOTE: L'index dépend de l'ordre de vos colonnes (ici, on suppose la 2e)
    const departmentHeader =
      fixture.nativeElement.querySelector('th:nth-child(2)');
    departmentHeader.click();

    // 2. Vérifier que l'événement est émis avec tri: DEPARTMENT, ordre: ASC, et page: 1
    expect(component.sortChanged.emit).toHaveBeenCalledWith({
      _page: 1,
      _limit: PAGE_LIMIT,
      _sort: Sort.DEPARTMENT, // Nouvelle colonne
      _order: 'asc', // Tri initial (ASC)
    });
  });

  it('should emit sortChanged event with DESC order on second click of the same column', () => {
    spyOn(component.sortChanged, 'emit');

    // Définir l'état initial: Tri actif sur NAME (ASC)
    component.query = { ...DEFAULT_QUERY, _sort: Sort.NAME, _order: 'asc' };
    fixture.detectChanges();

    // 1. Trouver l'en-tête de colonne 'NAME' (tri actif)
    // NOTE: L'index dépend de l'ordre de vos colonnes (ici, on suppose la 1e)
    const nameHeader = fixture.nativeElement.querySelector('th:nth-child(1)');

    // 2. Clic pour passer à DESC
    nameHeader.click();

    // 3. Vérifier que l'événement est émis avec tri: NAME, ordre: DESC, et page: 1
    expect(component.sortChanged.emit).toHaveBeenCalledWith({
      _page: 1,
      _limit: PAGE_LIMIT,
      _sort: Sort.NAME,
      _order: 'desc', // Changement d'ordre
    });
  });

  // --- GROUPE 3: Tests de la Logique de Pagination (Méthodes et Limites) ---

  it('should correctly determine the total number of pages (3 pages for 24 items / 10 limit)', () => {
    // totalCount = 24, _limit = 10. Math.ceil(24/10) = 3
    // Nous testons la logique de calcul de la dernière page.
    component.query._page = 1;
    // La page 1 n'est pas la dernière, car la dernière est 3.
    expect(component.isLastPage()).toBeFalse();
  });

  it('should return FALSE for isLastPage on page 2', () => {
    component.query._page = 2;
    expect(component.isLastPage()).toBeFalse();
  });

  it('should return TRUE for isLastPage on page 3', () => {
    component.query._page = 3;
    expect(component.isLastPage()).toBeTrue();
  });

  it('should disable NEXT button when on the last page', () => {
    component.query._page = 3;
    fixture.detectChanges();

    const nextButton = fixture.nativeElement.querySelector(
      'nav button:last-child' // Sélectionne le dernier bouton de la pagination
    );
    // Le bouton doit être désactivé
    expect(nextButton.disabled).toBeTrue();
  });

  it('should NOT emit pageChange on nextPage() when on the last page', () => {
    spyOn(component.pageChange, 'emit');
    component.query._page = 3;

    component.nextPage();
    // L'événement ne doit pas être émis
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should NOT emit pageChange on prevPage() when on page 1', () => {
    spyOn(component.pageChange, 'emit');
    component.query._page = 1;

    component.prevPage();
    // L'événement ne doit pas être émis (grâce au 'return' dans la méthode)
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });
});
