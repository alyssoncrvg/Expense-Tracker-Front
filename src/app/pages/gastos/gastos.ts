import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DatePickerModule } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { LoaderComponent } from '../../component/loader/loader';
import { CategoriesService } from '../../services/categoires/categories';
import { Category } from '../../models/categorie.model';


@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, TableModule, ButtonModule, DialogModule,
    InputTextModule, InputNumberModule, SelectButtonModule, DatePickerModule,
    Select, LoaderComponent
  ],
  templateUrl: './gastos.html',
  styleUrl: './gastos.css'
})
export class Gastos implements OnInit {
  private fb = inject(FormBuilder);
  private categoriesService = inject(CategoriesService);

  isLoading = signal(true);
  displayModal = signal(false);
  isSubmitting = signal(false);

  transactionForm!: FormGroup;
  transactions = signal<any[]>([]);


  typeOptions = [
    { label: 'Despesa', value: 'EXPENSE' },
    { label: 'Receita', value: 'INCOME' }
  ];

  categories = signal<Category[]>([]);

  ngOnInit() {
    this.initForm();
    this.loadTransactions();
    this.loadCategories();
  }

  initForm() {
    this.transactionForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      date: [new Date(), [Validators.required]],
      type: ['EXPENSE', [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  loadCategories() {
    this.categoriesService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: (err) => {
        console.error('Erro ao carregar categorias', err);
        // Opcional: Mostrar um toast de erro
      }
    });
  }

  loadTransactions() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.transactions.set([
        { description: 'Supermercado Mensal', amount: 850.50, date: '2025-12-10', type: 'EXPENSE', category: { name: 'Alimentação' } },
        { description: 'Salário', amount: 5000.00, date: '2025-12-05', type: 'INCOME', category: { name: 'Salário' } },
      ]);
      this.isLoading.set(false);
    }, 1500);
  }

  showDialog() {
    this.transactionForm.reset({
      date: new Date(),
      type: 'EXPENSE'
    });
    this.displayModal.set(true);
  }

  onSubmit() {
    if (this.transactionForm.invalid) return;

    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const rawValue = this.transactionForm.value;
    const formattedDate = rawValue.date instanceof Date
      ? rawValue.date.toISOString().split('T')[0]
      : rawValue.date;

    const payload = {
      description: rawValue.description,
      amount: rawValue.amount,
      date: formattedDate,
      type: rawValue.type,
      categoryId: rawValue.categoryId?.uuid 
    };

    setTimeout(() => {
      this.transactions.update(list => [
        {
          ...payload,
          category: { name: rawValue.categoryId.name }
        },
        ...list
      ]);

      this.isSubmitting.set(false);
      this.displayModal.set(false);
    }, 1500);
  }
}