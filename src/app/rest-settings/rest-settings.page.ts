import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import * as firebase from 'firebase';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-rest-settings',
  templateUrl: './rest-settings.page.html',
  styleUrls: ['./rest-settings.page.scss'],
})


export class RestSettingsPage implements OnInit {

  restInfo: any = {}
  isCompanyAdmin: boolean = false
  newRest: boolean = false
  
  constructor(public loadingController: LoadingController,
    private route: ActivatedRoute,
    public modalController: ModalController,
    private navCrtl: NavController,
    private router: Router,
    private toast: ToastController) { }

  functions = firebase.app().functions('europe-west3')

  ngOnInit() {
    const sys = firebase.firestore().collection('system').doc('permissionManagement')
    sys.get().then((data) => {
      if(data.data().admins.includes(firebase.auth().currentUser.uid)){
        this.isCompanyAdmin = true
      }
      this.route.params.subscribe((params) => {
        if(params.gastroID) {
          if(!(params.gastroID == "newRest")){
            this.restInfo.restaurantID  = params.gastroID
            this.newRest = false
            // fill current rest data into the form
            this.fetchRestInformations()
          } else {
            this.newRest = true
          }
        } else {
          // KEINE PARAMETER
        }
      })
    })
  }

  goBack(){
    this.navCrtl.pop()
  }

  async fetchRestInformations(){
    const restaurant = firebase.firestore().collection('restaurants').doc(this.restInfo.restaurantID)
    
    const loading = await this.loadingController.create({
      message: 'Bitte warten...'
    });
    await loading.present();

    restaurant.get().then((data) => {
      const restData = data.data()
      
      if(restData.restID){
        this.restInfo.restID = restData.restID
      }
      if(restData.restName && this.isCompanyAdmin){
        this.restInfo.restName = restData.restName
      }
      if(restData.restDescription){
        this.restInfo.restDescription = restData.restDescription
      }
      if(restData.restCellphone) {
        this.restInfo.restCellphone = restData.restCellphone
      }
      if(restData.restTables) {
        this.restInfo.restTables = restData.restTables
      }
      if(restData.restState && this.isCompanyAdmin) {
        this.restInfo.restState = restData.restState
      }
      if(restData.restClosingTime) {
        this.restInfo.restClosingTime = restData.restClosingTime
      }
      if(restData.restLogo) {
        this.restInfo.restLogo = restData.restLogo
      }
      if(restData.restPDF) {
        this.restInfo.restPDF = restData.restPDF
      }

      console.log(this.restInfo)
      loading.dismiss()
    })
  }

  async updateRestaurant(){
    if(!this.restInfo.restaurantID){
      this.createToast("Bitte loggen sie sich neu ein und versuchen sie es erneut.", "Fehler beim Restaurant Update.")
      return
    }
    if(!this.restInfo.restName && this.isCompanyAdmin){
      this.createToast("Bitte tragen sie einen Gültigen Namen ein.", "Fehler beim Restaurant Update.")
      return
    }
    if(!this.restInfo.restCellphone) {
      this.createToast("Bitte tragen sie einen Telefonnummer ein.", "Fehler beim Restaurant Update.")
      return
    }
    if(!this.restInfo.restTables) {
      this.createToast("Bitte tragen sie einen Gültigen wert unter den Tischanzahl ein.", "Fehler beim Restaurant Update.")
      return
    }
    if(!this.restInfo.restState && this.isCompanyAdmin) {
      this.createToast("Bitte wählen sie ein Bundesland aus.", "Fehler beim Restaurant Update.")
      return
    }
    if(!this.restInfo.restClosingTime) {
      this.createToast("Bitte wählen sie die Schließungszeit", "Fehler beim Restaurant Update.")
      return
    }

    const loading = await this.loadingController.create({
      message: 'Bitte warten...'
    });
    await loading.present();

    const updateRestaurantInformations = this.functions.httpsCallable('updateRestaurantInformations')
    updateRestaurantInformations(this.restInfo).then(() => {
        loading.dismiss()
        this.createToast("Restaurant wird upgedated, es sollte in kürze passieren.", "Restaurant wird upgedated.")
      }).catch((err) => {
        loading.dismiss()
        this.createToast(err,"Fehler beim updaten des Restaurants.")
      })
  }

  async addRestaurant(){
    if(!this.isCompanyAdmin){
      this.createToast("Sie haben nicht die Ausreichenden berechtigungen ein Neues Restaurant hinzuzufügen.", "Fehler beim Restaurant Update.")
      return
    }
    if(!this.restInfo.restDescription){
      this.createToast("Bitte fügen sie eine Beschreibung hinzu.", "Fehler beim Restaurant Update.")
      return
    }
    if(!this.restInfo.restaurantID){
      this.createToast("Bitte loggen sie sich neu ein und versuchen sie es erneut.", "Fehler beim Restaurant Update.")
      return
    }
    if(!this.restInfo.restName){
      this.createToast("Bitte tragen sie einen Gültigen Namen ein.", "Fehler beim Restaurant Update.")
      return
    }
    if(!this.restInfo.restCellphone) {
      this.createToast("Bitte tragen sie einen Telefonnummer ein.", "Fehler beim Restaurant Update.")
      return
    }
    if(!this.restInfo.restTables) {
      this.createToast("Bitte tragen sie einen Gültigen wert unter den Tischanzahl ein.", "Fehler beim Restaurant Update.")
      return
    }
    if(!this.restInfo.restState) {
      this.createToast("Bitte wählen sie ein Bundesland aus.", "Fehler beim Restaurant Update.")
      return
    }
    if(!this.restInfo.restClosingTime) {
      this.createToast("Bitte wählen sie die Schließungszeit", "Fehler beim Restaurant Update.")
      return
    }

    const loading = await this.loadingController.create({
      message: 'Bitte warten...'
    });
    await loading.present();

    const addNewRestaurant = this.functions.httpsCallable('addNewRestaurant')
    addNewRestaurant(this.restInfo).then(() => {
        loading.dismiss()
        this.createToast("Neues restaurant wird hinzugefügt, es sollte in kürze erscheinen.", "Restaurant wird erstellt.")
      }).catch((err) => {
        loading.dismiss()
        this.createToast(err,"Fehler beim erstellen des Restaurants.")
        console.log(err)
      })
  }

  restQrGen(){
    this.router.navigate(['genqr', { gastroID: this.restInfo.restaurantID }])
  }

  restUsermanagemer(){
    this.router.navigate(['usermanager', { gastroID: this.restInfo.restaurantID }])
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
