import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-usermanager',
  templateUrl: './usermanager.page.html',
  styleUrls: ['./usermanager.page.scss'],
})
export class UsermanagerPage implements OnInit {
  loginInformations: any = {}

  functions = firebase.app().functions('europe-west3')

  constructor(public loadingController: LoadingController, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if(params.gastroID) {
        this.loginInformations.restaurantID  = params.gastroID
      } else {
        // KEINE PARAMETER
      }
    })
  }

  createAccount(){
    if(!this.loginInformations.email || !this.loginInformations.password || !this.loginInformations.restaurantID){
      // KEINE INFOS
      console.log("es fehlt was ?")
      return
    } else if (this.loginInformations.restRole == "admin") {
      this.addAdmin()
    } else if (this.loginInformations.restRole == "employee") {
      this.addEmployee()
    }
  }

  async addEmployee(){
    const loading = await this.loadingController.create({
      message: 'Bitte warten...'
    });
    await loading.present();

    const createEmployeeForRestaurant = this.functions.httpsCallable('createEmployeeForRestaurant')
    createEmployeeForRestaurant(this.loginInformations).then(() => {
      loading.dismiss()
    }).catch((err) => {
      loading.dismiss()
      console.log(err)
    })
  }

  async addAdmin(){
    const loading = await this.loadingController.create({
      message: 'Bitte warten...'
    });
    await loading.present();

    const createAdminForRestaurant = this.functions.httpsCallable('createAdminForRestaurant')
    createAdminForRestaurant(this.loginInformations).then(() => {
      loading.dismiss()
    }).catch((err) => {
      loading.dismiss()
      console.log(err)
    })
  }
}
