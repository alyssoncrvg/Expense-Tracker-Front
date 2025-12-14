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
import { MessageService } from 'primeng/api';
import { CategoriesService } from '../../services/categoires/categories';
import { Category } from '../../models/categorie.model';
import { TransactionRequest } from '../../models/transaction.model';
import { TransactionsService } from '../../services/transaction/transaction';

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
  private transactionsService = inject(TransactionsService);
  private messageService = inject(MessageService);

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
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Erro categorias', err)
    });
  }


  loadTransactions() {
     this.isLoading.set(true);
     this.transactionsService.getAll().subscribe({
       next: (data) => {
         this.transactions.set(data);
         this.isLoading.set(false);
       },
       error: (err) => {
         console.error(err);
         this.isLoading.set(false);
       }
     });
  }


  showDialog() {
    this.transactionForm.reset({
      date: new Date(),
      type: 'EXPENSE'
    });
    this.displayModal.set(true);
  }

  onSubmit() {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const rawValue = this.transactionForm.value;
    
    const formattedDate = rawValue.date instanceof Date
      ? rawValue.date.toISOString().split('T')[0]
      : rawValue.date;

    const payload: TransactionRequest = {
      description: rawValue.description,
      amount: rawValue.amount,
      date: formattedDate,
      type: rawValue.type,
      categoryId: rawValue.categoryId?.uuid
    };

    this.transactionsService.create(payload).subscribe({
      next: (newTransaction) => {
        this.transactions.update(list => [newTransaction, ...list]);

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Transação registrada com sucesso!',
          life: 3000
        });

        this.isSubmitting.set(false);
        this.displayModal.set(false);
        this.transactionForm.reset();
      },
      error: (err) => {
        console.error('Erro ao salvar transação', err);
        
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao salvar a transação. Tente novamente.'
        });

        this.isSubmitting.set(false);
      }
    });
  }
}