import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut} from "firebase/auth";
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  //constructor() { }
  auth = inject(AngularFireAuth);

  //============== Autenticacion ==============
  async signIn(correo:string, clave:string){
    return await signInWithEmailAndPassword(getAuth(), correo, clave)
  }
  async register(correo:string, clave:string){
    return await createUserWithEmailAndPassword(getAuth(), correo, clave)
  }

  async signOut(){
    return await signOut(getAuth())
  }
}
