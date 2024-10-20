import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor( private platform: Platform, private router: Router) {
    this.initializeApp();
  }
  async initializeApp(){/*
    await SplashScreen.show({
      showDuration: 5000,
      autoHide: false
    })*/
    setTimeout(() => {
      this.router.navigateByUrl('/login'); // Redirige a la página principal después del splash
    }, 3000); // Muestra el splash por 3 segundos
    this.platform.ready().then(()=>{
      SplashScreen.hide();
    })
  }

  ngOnInit(): void{
    this.platform.ready().then(()=>{
      SplashScreen.hide();
    })
  }
}

/*
"SplashScreen": {
      "launchShowDuration": 1000,
      "launchAutoHide": true,
      "launchFadeOutDuration": 1000,
      "backgroundColor": "#ffffffff",
      "androidSplashResourceName": "splash",
      "androidScaleType": "CENTER_CROP",
      "showSpinner": true,
      "androidSpinnerStyle": "large",
      "iosSpinnerStyle": "small",
      "spinnerColor": "#999999",
      "splashFullScreen": true,
      "splashImmersive": true,
      "layoutName": "launch_screen",
      "useDialog": true
    }
 */