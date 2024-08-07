import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Pensamento } from './pensamento';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PensamentoService {

  private readonly API = 'http://localhost:3000/pensamentos'
  constructor(private http: HttpClient) { }

  listar(): Observable<Pensamento[]> {
    return this.http.get<Pensamento[]>(this.API)
  }

  getNextId(): Observable<number> {
    return this.http.get<Pensamento[]>(this.API).pipe(
      map(pensamentos => {
        const validIds = pensamentos
          .map(p => parseInt(p.id as string, 10))  // Convertendo string para número
          .filter(id => !isNaN(id));  // Filtrar IDs válidos (números)
        const lastId = validIds.length > 0 ? Math.max(...validIds) : 0;
        return lastId + 1;
      })
    );
  }

  criar(pensamento: Pensamento): Observable<Pensamento> {
    return this.getNextId().pipe(
      map(nextId => {
        pensamento.id = nextId.toString();  // Convertendo o ID para string antes de salvar
        return pensamento;
      }),
      switchMap(pensamentoComId => this.http.post<Pensamento>(this.API, pensamentoComId))
    );
  }

  editar(pensamento: Pensamento): Observable<Pensamento> {
    const url = `${this.API}/${pensamento.id}`
    return this.http.put<Pensamento>(url, pensamento)
  }

  excluir(id: string): Observable<Pensamento> {
    const url = `${this.API}/${id}`
    return this.http.delete<Pensamento>(url)
  }

  buscarPorId(id: string): Observable<Pensamento> {
    const url = `${this.API}/${id}`
    return this.http.get<Pensamento>(url)
  }

}
