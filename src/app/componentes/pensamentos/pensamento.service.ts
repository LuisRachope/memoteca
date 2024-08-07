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
          .map(p => p.id)
          .filter(id => id !== undefined) as number[]; // Filtrar IDs válidos e assegurar que são números
        const lastId = validIds.length > 0 ? Math.max(...validIds) : 0;
        return lastId + 1;
      })
    );
  }

  criar(pensamento: Pensamento): Observable<Pensamento> {
    return this.getNextId().pipe(
      map(nextId => {
        pensamento.id = nextId;
        return pensamento;
      }),
      switchMap(pensamentoComId => this.http.post<Pensamento>(this.API, pensamentoComId))
    );
  }

}
