import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { LoadingController } from '@ionic/angular';
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
  elementType: 'url' | 'canvas' | 'img' = 'canvas';

  testData = "https://www.google.de/"

  restData: any = {}
  baseUrl: string = "https://gastrocheck.web.app"

  constructor(public loadingController: LoadingController, private route: ActivatedRoute) { }

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
    console.log(this.restData.restaurantID)
    console.log(this.restData.restState)
    console.log(this.table)
    if(this.restData.restaurantID && this.restData.restState && this.table){
      this.qrData = this.baseUrl + "?gastroID=" + this.restData.restaurantID  + "&table=" + this.table + "&state=" + this.restData.restState
    } else {
      console.log("sachen fehlen...")
    }
  }

}
