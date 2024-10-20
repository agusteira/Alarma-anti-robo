import { Component, OnDestroy, OnInit } from '@angular/core';
import { Device } from '@capacitor/device';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { Haptics } from '@capacitor/haptics';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { EmailAuthProvider, reauthenticateWithCredential } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [
    Flashlight,  // Asegúrate de que el servicio esté aquí
  ],
})
export class HomePage implements OnInit, OnDestroy {
  private password = '1234'; // Contraseña para desactivar
  detectorActive = false;
  mostrarAlerta = false;
  mensajeAlerta = '';
  value = "";
  clave = "";
  beta!: any;
  gamma!: any;
  flag = false;
  desloguarseee = false;
  movementDetected = false;

  rotacion: string = "";
  rotacionB: string = "";

  flashlightOn = false;
  private intervalId: any;

  constructor(private flashlight: Flashlight,public auth: Auth, private afAuth: AngularFireAuth, private router: Router) {}

  ngOnInit() {
    // Configura el intervalo para actualizar los valores cada segundo
    this.intervalId = setInterval(() => {
      if (this.detectorActive) {
        this.handleOrientationChange({
          beta: this.beta,
          gamma: this.gamma,
        } as DeviceOrientationEvent);
      }
    }, 1000);

    
  }

  ngOnDestroy() {
    // Limpia el intervalo cuando el componente se destruya
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  async toggleDetector() {
    this.detectorActive = !this.detectorActive;
    if (this.detectorActive) {
      await this.startDetection();
    } else {
      this.mostrarAlerta = true;
      this.detectorActive = true;
    }
  }

  async startDetection() {
    const info = await Device.getInfo();
    if (info.platform === 'web') {
      console.log('Detección solo funciona en dispositivos reales');
    } else {
      window.addEventListener('deviceorientation', this.handleOrientationChange.bind(this));
    }
  }


  async handleOrientationChange(event: DeviceOrientationEvent) {
    if (!this.detectorActive) return;
    
    this.beta = event.beta;
    this.gamma = event.gamma;
  
    // Verificamos que beta y gamma no sean null
    if (this.beta !== null && this.gamma !== null) {
      // Comprobamos si hay un movimiento reciente
      if(!this.movementDetected){

      
        // Gamma se usa para rotación lateral
        if (this.gamma > 30) {
          this.rotacion = this.gamma;
          this.reproducirSonido('alerta-derecha');
          this.flag = true;
          this.movementDetected = true;
        } else if (this.gamma < -30) {
          this.rotacion = this.gamma;
          this.reproducirSonido('alerta-izquierda');
          this.flag = true;
          this.movementDetected = true;
        } else {
          this.rotacion = this.gamma;
        }
  
        // Beta se usa para detectar vertical
        if (this.beta > 30 || this.beta < -30) {
          this.rotacionB = this.beta;
          this.flag = true;
          this.activateVerticalMode();
          this.movementDetected = true;
        } else if ((this.beta < 30 && this.beta > -30) && (this.gamma < 30 && this.gamma > -30) && this.flag) {
          this.rotacionB = this.beta;
          this.flag = false;
          this.activateHorizontalMode();
        } else {
          this.rotacionB = this.beta;
        }
  
        // Iniciamos el temporizador de 5 segundos
        if(this.movementDetected){
          setTimeout(() => {
            this.movementDetected = false;
          }, 5000);
        }
        
      }
    } else {
      console.error('Valores de orientación no disponibles.');
    }
  }
  

  async activateVerticalMode() {
    console.log('Activado modo vertical');
    if (!this.flashlightOn) {
      this.prenderLinterna();
    }
    this.reproducirSonido('alerta-vertical');
  }

  async activateHorizontalMode() {
    console.log('Activado modo horizontal');
    await Haptics.vibrate({ duration: 5000 });
    this.reproducirSonido('alerta-horizontal');
  }

  reproducirSonido(cosa:string){

    const audioContext = new (window.AudioContext || window.AudioContext)();
    const ruta = `assets/audios/${cosa}.mp3`;
    const audioElement = new Audio(ruta);

    // Crear un elemento de audio fuente
    const track = audioContext.createMediaElementSource(audioElement);

    // Crear un nodo de ganancia para amplificar el volumen
    const gainNode = audioContext.createGain();

    // Conectar la fuente de audio al nodo de ganancia
    track.connect(gainNode);

    // Conectar el nodo de ganancia al destino (altavoces)
    gainNode.connect(audioContext.destination);

    // Ajustar el nivel de ganancia por encima de 1 (esto es amplificar el volumen)
    //gainNode.gain.value = 5; // Por ejemplo, 2 es el doble del volumen original

    // Reproducir el audio
    audioElement.play().then(() => {
    }).catch(error => {
      console.error('Error al reproducir el sonido:', error);
    });
  }

  async triggerAlarm() {
    Haptics.vibrate({ duration: 5000 });
    this.prenderLinterna();
    this.reproducirSonido('alerta-roja');
    console.log('Contraseña incorrecta: Alarma activada');
  }

  async prenderLinterna() {
    this.flashlightOn = true;
    try {
      this.flash(true);
      setTimeout(async () => {
        this.flash(false);
        this.flashlightOn = false;
      }, 5000);
    } catch (error) {
      this.flash(false);
      this.flashlightOn = false;
      console.error('Error al controlar la linterna:', error);
    }
  }

  flash(condicion: boolean) {
    if (condicion) {
      this.flashlight.switchOn();
    } else {
      this.flashlight.switchOff();
    }
  }

  async cerrarAlerta(value: string) {
    try{
      const user = await this.afAuth.currentUser
      const credential = EmailAuthProvider.credential(user!.email!, value);
      await reauthenticateWithCredential(user!, credential);
      
      console.log('Detector desactivado');
      this.detectorActive = false;
      this.mostrarAlerta = false;
      this.desloguarseee = true;
    }catch{
      this.triggerAlarm();
      this.mostrarAlerta = false;
      this.desloguarseee = false;
    }
  }

  async logout(value: string): Promise<void> {
    try {
      const user = await this.afAuth.currentUser
      const credential = EmailAuthProvider.credential(user!.email!, value);
      await reauthenticateWithCredential(user!, credential);

      await signOut(this.auth);
      this.goToLogin()
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  abrirOverlay(){
    this.desloguarseee = true;

  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
