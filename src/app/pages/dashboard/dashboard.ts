import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { LoaderComponent } from '../../component/loader/loader';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { DashboardData } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, TableModule, LoaderComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);
  
  isLoading = signal(true);
  dashboardData = signal<DashboardData | null>(null);
  
  balance = signal(0);
  monthlyIncome = signal(0);
  monthlyExpense = signal(0);
  lastTransactions = signal<any[]>([]); 

  cashFlowData: any;
  categoryData: any;
  memberData: any;
  
  basicOptions: any;
  horizontalOptions: any;
  donutOptions: any;

  ngOnInit() {
    this.initChartOptions();
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading.set(true);
    
    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.balance.set(data.balance);
        this.monthlyIncome.set(data.monthlyIncome);
        this.monthlyExpense.set(data.monthlyExpense);
        this.lastTransactions.set(data.lastTransactions);
        
        this.dashboardData.set(data);
        this.cashFlowData = data.cashFlowChart;
        this.setupCategoryChart(data.expensesByCategory);
        this.setupMemberChart(data.expensesByPerson);

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar dashboard', err);
        this.isLoading.set(false);
      }
    });
  }

  setupCategoryChart(categories: { categoryName: string; amount: number }[]) {
    if (!categories || categories.length === 0) return;

    const bgColors = [
      'rgba(59, 130, 246, 0.7)', // Azul
      'rgba(168, 85, 247, 0.7)', // Roxo
      'rgba(236, 72, 153, 0.7)', // Rosa
      'rgba(234, 179, 8, 0.7)',  // Amarelo
      'rgba(34, 197, 94, 0.7)',  // Verde
      'rgba(249, 115, 22, 0.7)', // Laranja
      'rgba(100, 116, 139, 0.7)' // Cinza
    ];

    this.categoryData = {
      labels: categories.map(c => c.categoryName),
      datasets: [
        {
          data: categories.map(c => c.amount),
          backgroundColor: bgColors.slice(0, categories.length),
          hoverBackgroundColor: bgColors.slice(0, categories.length).map(c => c.replace('0.7', '0.9')),
          borderWidth: 0
        }
      ]
    };
  }

  setupMemberChart(people: { personName: string; amount: number }[]) {
    if (!people || people.length === 0) return;

    const bgColors = [
      'rgba(99, 102, 241, 0.7)',  // Indigo
      'rgba(217, 70, 239, 0.7)',  // Fuchsia
      'rgba(14, 165, 233, 0.7)',  // Sky
      'rgba(244, 63, 94, 0.7)',   // Rose
      'rgba(16, 185, 129, 0.7)'   // Emerald
    ];
    
    const borderColors = [
      'rgb(99, 102, 241)',
      'rgb(217, 70, 239)',
      'rgb(14, 165, 233)',
      'rgb(244, 63, 94)',
      'rgb(16, 185, 129)'
    ];

    this.memberData = {
      labels: people.map(p => p.personName),
      datasets: [
        {
          label: 'Total Gasto',
          data: people.map(p => p.amount),
          backgroundColor: bgColors.slice(0, people.length),
          borderColor: borderColors.slice(0, people.length),
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.6
        }
      ]
    };
  }

  initChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#4b5563';
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#9ca3af';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#e5e7eb';

    this.basicOptions = {
      plugins: {
        legend: { labels: { color: textColor } },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder, drawBorder: false }
        },
        x: {
          ticks: { color: textColorSecondary },
          grid: { display: false, drawBorder: false }
        }
      }
    };

    this.donutOptions = {
      plugins: {
        legend: { display: false }
      },
      cutout: '60%'
    };

    this.horizontalOptions = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          beginAtZero: true,
          display: false,
          grid: { display: false }
        },
        y: {
          ticks: { color: textColor },
          grid: { display: false }
        }
      }
    };
  }
}