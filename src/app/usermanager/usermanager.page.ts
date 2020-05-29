import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-usermanager',
  templateUrl: './usermanager.page.html',
  styleUrls: ['./usermanager.page.scss'],
})
export class UsermanagerPage implements OnInit {
  loginInformations: any = {}

  functions = firebase.app().functions('europe-west3')

  constructor(public loadingController: LoadingController, private route: ActivatedRoute, private navCrtl: NavController, private toast: ToastController) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if(params.gastroID) {
        this.loginInformations.restaurantID  = params.gastroID
      } else {
        // KEINE PARAMETER
      }
    })
  }

  goBack(){
    this.navCrtl.pop()
  }

  createAccount(){
    if(!this.loginInformations.restaurantID){
      this.createToast("Bitte loggen sie sich neu ein und versuchen sie es erneut.","Fehler beim erstellen des Nutzers.")
      return
    } else if(!this.loginInformations.email) {
      this.createToast("Bitte geben sie eine E-Mail ein.","Fehler beim erstellen des Nutzers.")
      return
    } else if(!this.loginInformations.password) {
      this.createToast("Bitte geben sie ein Passwort ein.","Fehler beim erstellen des Nutzers.")
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
      this.createToast("Mitarbeiter Nutzerzugang wird erstellt, dieser wird in Kürze verfügbar sein.", "Nutzer wird erstellt.")
      loading.dismiss()
    }).catch((err) => {
      loading.dismiss()
      this.createToast(err,"Fehler beim erstellen des Nutzers.")
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
      this.createToast("Administrations Nutzerzugang wird erstellt, dieser wird in Kürze verfügbar sein.", "Nutzer wird erstellt.")
    }).catch((err) => {
      loading.dismiss()
      this.createToast(err,"Fehler beim erstellen des Nutzers.")
    })
  }

  async createToast(msg, header){
    const toastMSG = await this.toast.create({
      header: header,
      message: msg,
      duration: 2000
    })

    toastMSG.present()
  }
}
