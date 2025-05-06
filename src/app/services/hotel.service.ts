import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hotel } from '../models/hotel';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  private apiUrl = 'https://68107c7227f2fdac24119022.mockapi.io/hoteles';

  constructor(private http: HttpClient) {}

  obtenerHoteles(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.apiUrl);
  }

}
