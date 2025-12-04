import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToolsTable } from '../../components/tools-table/tools-table';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  map,
  Observable,
  shareReplay,
  startWith,
  Subscription,
  tap,
} from 'rxjs';
import { IToolFilter, Sort } from '../../services/dto/tools.filter.dto';
import { ITool } from '../../types/tool';
import { ToolsService } from '../../services/tools.service'; 
import { AsyncPipe, CurrencyPipe } from '@angular/common'; 
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DepartmentService } from '../../services/department.service'; 
import { IDepartment } from '../../types/department';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { MatSliderModule } from '@angular/material/slider';
// Import des fonctions utilitaires externalisées
import { applyFilters, sortTools } from '../../utils/utils';

@Component({
  selector: 'app-tools',
  imports: [
    ToolsTable,
    AsyncPipe,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    MatSliderModule,
  ],
  templateUrl: './tools.html',
  styleUrl: './tools.css',
  standalone: true,
})
export class ToolsPage implements OnInit, OnDestroy {
  // --- INJECTION DES DÉPENDANCES ---
  constructor(
    private formBuilder: FormBuilder,
    private toolsService: ToolsService,
    private departmentService: DepartmentService
  ) {}

  // --- PROPRIÉTÉS OBSERVABLES (BINDING ASYNC) ---
  tools$!: Observable<ITool[]>; 
  query$!: Observable<IToolFilter>; 
  totalCount$!: Observable<number>; 
  departments$!: Observable<IDepartment[]>; 
  searchForm!: FormGroup; 
  categories$!: Observable<string[]>; 

  // Valeurs par défaut pour les bornes du slider
  private defaultMinPrice = 0;
  private defaultMaxPrice = 2000; // Utilisé comme valeur initiale

  // Subjects pour émettre les limites de prix minimales et maximales trouvées dans le jeu de données
  private minPriceSubject = new BehaviorSubject<number>(this.defaultMinPrice);
  minPrice$: Observable<number> = this.minPriceSubject.asObservable();

  private maxPriceSubject = new BehaviorSubject<number>(this.defaultMaxPrice); 
  maxPrice$: Observable<number> = this.maxPriceSubject.asObservable();

  private filteredToolsSubject = new BehaviorSubject<ITool[]>([]);
  filteredTools$: Observable<ITool[]> =
    this.filteredToolsSubject.asObservable();

  private totalCountSubject = new BehaviorSubject<number>(0);

  private searchFilterState = new BehaviorSubject<any>({});

  private currentQuery: IToolFilter = {
    _page: 1,
    _limit: 10,
    _order: 'asc',
    _sort: Sort.ID,
  };

  private filterSubscription!: Subscription;

  ngOnInit() {
    this.totalCount$ = this.totalCountSubject.asObservable()

    // 1. OBTENIR TOUTES LES DONNÉES BRUTES
    const toolsResponse$ = this.toolsService
      .getTools()
      .pipe(
        // LOGIQUE : Calculer min/max prix et mettre à jour les Subjects APRÈS le chargement des données
        tap((response) => {
          const tools = response.tools || [];
          let min = this.defaultMinPrice;
          let max = this.defaultMaxPrice;

          if (tools.length > 0) {
            const prices = tools.map(tool => +(tool as any).monthly_cost || 0);
            min = Math.min(...prices);
            max = Math.max(...prices);
          }

          // Mise à jour des Subjects (bornes du dataset)
          this.minPriceSubject.next(min);
          this.maxPriceSubject.next(max);
          
          this.searchForm.patchValue({
             minPrice: min, 
             maxPrice: max, 
          }, { emitEvent: false });
        }),
        shareReplay({ bufferSize: 1, refCount: true })
      );

    this.tools$ = toolsResponse$.pipe(map((response) => response.tools!));
    this.categories$ = this.toolsService.getCategories();

    this.searchForm = this.formBuilder.group({
      department: new FormControl(null),
      status: new FormControl(null),
      categories: new FormControl(null),
      // Contrôles séparés pour le Range Slider, initialisés avec les valeurs par défaut du Subject
      minPrice: new FormControl(this.minPriceSubject.getValue()),
      maxPrice: new FormControl(this.maxPriceSubject.getValue()),
    });

    // 3. GESTION DE LA REQUÊTE (PAGINATION/TRI)
    this.query$ = this.toolsService.queryParams$.pipe(
      startWith(this.currentQuery),
      tap((query) => {
        this.currentQuery = query;
      })
    );

    const pageParams$ = this.query$.pipe(
      map((params) => ({
        page: params._page || 1,
        limit: params._limit || 10,
        sort: params._sort || Sort.ID,
        order: params._order || 'asc',
      }))
    );

    this.departments$ = this.departmentService.getDepartments();

    // 4. GESTION DES CHANGEMENTS DE FILTRES DU FORMULAIRE
    const filterChanges$ = this.searchForm.valueChanges.pipe(
      startWith(this.searchForm.value), 
      debounceTime(100), 
      tap((filters) => this.searchFilterState.next(filters))
    );

    const filterStateChange$ = this.searchFilterState.asObservable();

    // 5. LE PIPELINE RÉACTIF CENTRAL
    const combinedFilter$ = combineLatest([
      this.tools$, // [0] Les données brutes
      filterChanges$, // [1] Les valeurs actuelles des filtres du formulaire
      pageParams$, // [2] Les paramètres actuels de pagination/tri
      filterStateChange$, // [3] L'état synchrone des filtres (pour comparaison dans le tap)
      this.minPrice$, // [4] Le prix minimum réel du dataset
      this.maxPrice$, // [5] Le prix maximum réel du dataset
    ]).pipe(
      debounceTime(10), 
      
      tap(([
        _allTools,
        currentFilter,
        pageParams,
        _filterState,
        _datasetMin,
        _datasetMax,
      ]) => {
        const previousFilterState = this.searchFilterState.getValue();

        const currentFilterString = JSON.stringify({
             department: currentFilter.department, 
             status: currentFilter.status,
             categories: currentFilter.categories,
             minPrice: currentFilter.minPrice, 
             maxPrice: currentFilter.maxPrice,
        });
        const previousFilterString = JSON.stringify(previousFilterState);

        // Si les filtres ont changé ET que nous ne sommes pas déjà sur la page 1
        if (
          currentFilterString !== previousFilterString &&
          pageParams.page !== 1
        ) {
          this.toolsService.updateQuery({ _page: 1 });
        }
      }),

      // Le map qui effectue le filtrage, le tri et la pagination
      map(([allTools, filter, pageParams, _filterState]) => {
        // 1. FILTRAGE - Utilisation des bornes du dataset pour le filtre de prix
        let filteredData = applyFilters(allTools, filter);

        // 2. TRI CÔTÉ CLIENT 
        if (pageParams.sort && pageParams.order) {
          filteredData = sortTools(
            filteredData,
            pageParams.sort,
            pageParams.order
          );
        }

        // 3. MISE À JOUR DU COMPTEUR
        this.totalCountSubject.next(filteredData.length);

        // 4. PAGINATION CÔTÉ CLIENT (découpage)
        const startIndex = (pageParams.page - 1) * pageParams.limit;
        const endIndex = startIndex + pageParams.limit;

        return filteredData.slice(startIndex, endIndex);
      }),
      tap((paginatedTools) => this.filteredToolsSubject.next(paginatedTools)),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.filterSubscription = combinedFilter$.subscribe();
  }

  // --- MÉTHODES D'INTERACTION UTILISATEUR ---

  onSortChange(filter: IToolFilter) {
    this.toolsService.updateQuery({ ...filter, _page: 1 });
  }

  onPageChange(direction: 'prev' | 'next') {
    const currentQuery = this.currentQuery;
    const totalCount = this.totalCountSubject.getValue();

    if (!currentQuery) {
      return;
    }

    const currentPage = currentQuery._page || 1;
    const limit = currentQuery._limit || 10;

    const effectiveTotalCount = Math.max(0, totalCount);
    const maxPage = Math.ceil(effectiveTotalCount / limit);
    let newPage = currentPage;

    switch (direction) {
      case 'prev':
        if (currentPage > 1) {
          newPage = currentPage - 1;
        }
        break;
      case 'next':
        if (currentPage < maxPage) {
          newPage = currentPage + 1;
        }
        break;
    }

    if (newPage !== currentPage) {
      const newFilter: IToolFilter = { ...currentQuery, _page: newPage };
      this.toolsService.updateQuery(newFilter);
    }
  }

  // --- NETTOYAGE ---

  ngOnDestroy() {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }
}