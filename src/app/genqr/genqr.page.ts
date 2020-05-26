import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { LoadingController, NavController } from '@ionic/angular';
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

  constructor(public loadingController: LoadingController, private route: ActivatedRoute, private navCrtl: NavController) { }

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
      console.log("sachen fehlen...")
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
  }
}
