import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-genqr',
  templateUrl: './genqr.page.html',
  styleUrls: ['./genqr.page.scss'],
})
export class GenqrPage implements OnInit {
  functions = firebase.app().functions('europe-west3')

  qrData: any
  table: string
  elementType: 'canvas' //'url' | 'canvas' | 'img' = 'canvas';

  testData = "https://www.google.de/"

  restData: any = {}
  baseUrl: string = "https://gastrocheck.web.app/#/home"

  constructor(public loadingController: LoadingController, private route: ActivatedRoute, private navCrtl: NavController, private toast: ToastController) { }

  ngOnInit() {
    this.restData.restaurantID = null
    this.route.params.subscribe((params) => {
      if(params.gastroID) {
        this.restData.restaurantID = params.gastroID
        this.refresh()
      } else {
        // KEINE PARAMETER
      }
    })
  }

  goBack(){
    this.navCrtl.pop()
  }

  refresh(){
    if(this.restData.restaurantID){
      const restaurant = firebase.firestore().collection('restaurants').doc(this.restData.restaurantID)
      restaurant.get().then((data) => {
        this.restData.restaurantID = data.id
        this.restData.restState = data.data().restState
      }).catch((err) => { throw err })
    }
  }

  createCode(){
    if(this.restData.restaurantID && this.restData.restState && this.table){
      this.qrData = this.baseUrl + "?gastroID=" + this.restData.restaurantID  + "&table=" + this.table
    } else {
      this.createToast("Tragen sie bitte die Tischnummer ein, wenn das nicht hilft loggen sie sich neu ein und versuchen sie es erneut.","QR Code Generierung Fehlgeschlagen.")
    }
  }

  downloadQrCode(){
    const img = document.querySelector('img') as HTMLImageElement

    console.log(img.src)

    var downloadInstance = document.createElement("a"); //Create <a>
    downloadInstance.href = img.src;                    //Image Base64 Goes here
    downloadInstance.download = "Image.png";            //File name Here
    downloadInstance.click();                           //Downloaded file
    downloadInstance.remove();                          //Removes the Element

    this.createToast("Der Download von ihrem QR Code startet nun.", "Download startet...")
  }

  async createToast(msg, header){
    if(header == null) {
      const toastMSG = await this.toast.create({
        message: msg,
        duration: 2000
      })

      toastMSG.present();
      
    } else {
      const toastMSG = await this.toast.create({
        header: header,
        message: msg,
        duration: 2000
      })

      toastMSG.present();
    }
  }
}
