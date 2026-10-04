import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Transacao {
  id?: string;
  clienteId: string;
  pontos: number;
  valorReais: number;
  milhas: number;
  cupomCodigo: string;
  cupomUsado: boolean;
  status?: string;
  observacao?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  transacoes = signal<Transacao[]>([]);
  carregando = signal<boolean>(false);

  novaTransacao: Transacao = {
    clienteId: 'cliente_123',
    pontos: 100,
    valorReais: 100.00,
    milhas: 200,
    cupomCodigo: 'BONUS10',
    cupomUsado: false
  };

  private apiUrl = 'http://localhost:8080/api/transacoes';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarTransacoes();
  }

  carregarTransacoes() {
    this.http.get<Transacao[]>(this.apiUrl).subscribe({
      next: (dados) => this.transacoes.set(dados),
      error: (err) => console.error('Erro ao buscar transações:', err)
    });
  }

  cadastrarTransacao() {
    this.carregando.set(true);
    
    const payload = {
      ...this.novaTransacao,
      status: 'COMPRA_REALIZADA'
    };

    this.http.post<Transacao>(this.apiUrl, payload).subscribe({
      next: () => {
        this.carregarTransacoes();
        this.carregando.set(false);
        alert('Transação criada com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao cadastrar transação:', err);
        this.carregando.set(false);
        alert('Erro ao cadastrar transação. Verifique o backend.');
      }
    });
  }

  simularChargeback(id: string) {
    this.carregando.set(true);
    this.http.post(`${this.apiUrl}/${id}/chargeback`, {}).subscribe({
      next: () => {
        setTimeout(() => {
          this.carregarTransacoes();
          this.carregando.set(false);
        }, 1500);
      },
      error: (err) => {
        console.error('Erro ao enviar chargeback:', err);
        this.carregando.set(false);
      }
    });
  }
}