import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { LoaderComponent } from '../../component/loader/loader';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, LoaderComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  isLoading = signal(true);

  cashFlowData: any;
  categoryData: any;
  memberData: any;

  basicOptions: any;
  horizontalOptions: any;

  ngOnInit() {
    setTimeout(() => {
      this.initCharts();
      this.isLoading.set(false);
    }, 1500);
  }

  initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#4b5563';
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#9ca3af';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#e5e7eb';

    this.cashFlowData = {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Receitas',
          data: [12500, 13200, 11800, 14000, 15500, 16000],
          backgroundColor: 'rgba(34, 197, 94, 0.7)', // Verde
          borderColor: 'rgb(34, 197, 94)',
          borderRadius: 6,
          borderWidth: 1
        },
        {
          label: 'Despesas',
          data: [9500, 10200, 9800, 11000, 12000, 10500],
          backgroundColor: 'rgba(239, 68, 68, 0.7)', // Vermelho
          borderColor: 'rgb(239, 68, 68)',
          borderRadius: 6,
          borderWidth: 1
        }
      ]
    };

    // 2. Categorias (Rosca)
    this.categoryData = {
      labels: ['Alimentação', 'Moradia', 'Lazer', 'Educação', 'Transp.'],
      datasets: [
        {
          data: [35, 25, 15, 15, 10],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)', // Azul
            'rgba(168, 85, 247, 0.7)', // Roxo
            'rgba(236, 72, 153, 0.7)', // Rosa
            'rgba(234, 179, 8, 0.7)',  // Amarelo
            'rgba(34, 197, 94, 0.7)'   // Verde
          ],
          hoverBackgroundColor: [
            'rgba(59, 130, 246, 0.9)',
            'rgba(168, 85, 247, 0.9)',
            'rgba(236, 72, 153, 0.9)',
            'rgba(234, 179, 8, 0.9)',
            'rgba(34, 197, 94, 0.9)'
          ]
        }
      ]
    };

    this.memberData = {
      labels: ['Alysson', 'Maria', 'João', 'Casa (Geral)'],
      datasets: [
        {
          label: 'Gasto Total',
          data: [3200, 2800, 1500, 4500],
          backgroundColor: [
            'rgba(99, 102, 241, 0.7)', // Indigo
            'rgba(217, 70, 239, 0.7)', // Fuchsia
            'rgba(14, 165, 233, 0.7)', // Sky
            'rgba(107, 114, 128, 0.7)' // Gray
          ],
          borderColor: [
            'rgb(99, 102, 241)',
            'rgb(217, 70, 239)',
            'rgb(14, 165, 233)',
            'rgb(107, 114, 128)'
          ],
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    };

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

    this.horizontalOptions = {
      indexAxis: 'y',
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { beginAtZero: true, grid: { color: surfaceBorder } },
        y: { grid: { display: false } }
      }
    };
  }
}