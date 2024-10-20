import { Component, OnInit } from '@angular/core';
import {  inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  public correo:string; //El correo que sube el usuario
  public clave:string; //La clave que sube el usuario
  public logueo:string; //El string que devuelve la pagina para que el usuario sepa si el logueo fue exitoso
  public booleanLogueo:boolean; //El booleano que verifica si se logueo fue exitoso
  public mostrar:boolean;
  public botonLoguear:boolean;

  public usuario1Mail ="admin@admin.com";
  public usuario1Clave ="111111";

  public usuario2Mail ="asd@gmail.com.ar";
  public usuario2Clave ="1234567";

  public usuario3Mail ="asd@gmail.com.ar";

  constructor(public navCtrl: NavController) {
    this.correo = "";
    this.clave = "";
    this.logueo = "";
    this.mostrar = false;
    this.booleanLogueo = false;
    this.botonLoguear = true;
  }

  async IniciarSesion(correo:any, clave:any){
    if(await this.FirebaseVerification(correo, clave)){
      console.log("holaaa")
      this.navCtrl.navigateRoot("/home")
    }else{
      console.log("heeeeeeeeeeeeeeeeolaaa")
      this.mostrar = true;
      this.correo = correo;
      this.clave = clave;
      this.botonLoguear = false;
    }
  }

  VolverAlLogin(){
    this.mostrar = false;
    this.botonLoguear = true;
  }

  async FirebaseVerification(correo:string, clave:string){
    const loading = await this.utilSvc.loading();
    await loading.present();

    var retorno = false;

    if(this.validateCredentials(correo, clave)){
      await this.firebaseSvc.signIn(correo, clave).then(res =>{
        retorno = true;
      }).catch(error=>{
        this.logueo = "Usuario y/o contraseña incorrectos"; //Muestra el error ocurrido
      }).finally(() =>{
        loading.dismiss();
      })
    }else{
      loading.dismiss();
      this.logueo = "Credenciales inválidas";
    }
    
    return retorno
  }

  private validateCredentials(correo: string, clave: string): boolean {
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    const claveValida = clave.length >= 6;
  
    return correoValido && claveValida;
  }

  public accesoRapido(correo:string, clave:string){
    this.correo = correo;
    this.clave = clave;
  }

}
