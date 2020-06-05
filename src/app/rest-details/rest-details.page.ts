import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatePickerPage } from '../modal/date-picker/date-picker.page';

@Component({
  selector: 'app-rest-details',
  templateUrl: './rest-details.page.html',
  styleUrls: ['./rest-details.page.scss'],
})

export class RestDetailsPage implements OnInit {
  functions = firebase.app().functions('europe-west3')
  restInformations: any = {}
  loginInformations: any = {}
  guestListActive: Array<any> = new Array
  guestListInActive: Array<any> = new Array
  loggedIn: boolean = false
  restAdmin: boolean = false

  constructor(public alertController: AlertController, private router: Router, public modalController: ModalController, private toast: ToastController) { }

  ngOnInit() {
    if(firebase.auth().currentUser) {
      this.refresh()
      this.loggedIn = true
    }

    
  }

  employeeLogin(){
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
      firebase.auth().signInWithEmailAndPassword(this.loginInformations.email, this.loginInformations.password).then((usr) => {
        this.loggedIn = true;
        this.refresh()
        this.createToast("Du hast dich erfolgreich eingeloggt !", "Login Erfolgreich.")
      })
    })
  }

  employeeLogout(){
    firebase.auth().signOut().then(() => {
      this.loggedIn = false;
      this.createToast("Du wurdest nun ausgeloggt !", "Logout Erfolgreich.")
    })
  }

  fetchRestaurantData(){
    const restaurant = firebase.firestore().collection('restaurants');
    restaurant.doc(this.restInformations.restaurantID).get().then((data) => {
      const restData = data.data()
      this.restInformations.restName            = restData.restName
      this.restInformations.restDescription     = restData.restDescription
      this.restInformations.restCellphone       = restData.restCellphone
      this.restInformations.restState           = restData.restState
      this.restInformations.restTables          = restData.restTables
      this.restInformations.restActiveGuests    = restData.restActiveGuests
      this.restInformations.restInActiveGuests  = restData.restInActiveGuests
      this.restInformations.restAdmins          = restData.restAdmins
      this.restInformations.restEmployees       = restData.restEmployees
      if(restData.restAdmins.includes(firebase.auth().currentUser.uid)){
        this.restAdmin = true
      }

      this.orderGuests()
    })
  }

  refresh(){
    const user = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    if(firebase.auth().currentUser) {
      user.get().then((data) => {
        this.restInformations.restaurantID = data.data().restaurantID
        this.fetchRestaurantData()
      })
    }
  }

  orderGuests(){
    let guestListTempMap: Array<any> = new Array
    this.guestListActive = new Array
    this.guestListInActive = new Array
    const guest = firebase.firestore().collection('guests')
    this.restInformations.restActiveGuests.forEach(element => {
      guest.doc(element).get().then((data) => {
        let guestData = data.data()
        guestData.id = element
        guestListTempMap.push({table: Number(guestData.table), guestData: guestData})

        let highestTableNr: number = 0
        for(let index = 0; index < guestListTempMap.length; index++) {
          highestTableNr = Math.max(highestTableNr, guestListTempMap[index].table)
        }

        let userList
        for (let index = 0; index <= highestTableNr; index++) {
          userList = new Array
          for(let i = 0; i < guestListTempMap.length; i++) {
            if(guestListTempMap[i].table == index) {
              userList.push(guestListTempMap[i].guestData)
            }
          }
          if(userList.length > 0) {
            this.guestListActive.push({table: index, userList})
          }
        }
        
        console.log("Active:")
        console.log(this.guestListActive)
      })
    });

    this.restInformations.restInActiveGuests.forEach(element => {
      guest.doc(element).get().then((data) => {
        let guestData = data.data()
        guestData.id = element
        this.guestListInActive.push(guestData)
      })
    });
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.refresh()
    event.target.complete();
  }

  async openInformations(guestInfo){
    console.log("starting")
    const alert = await this.alertController.create({
      header: 'User Informations !',
      message: "Name: " + guestInfo.firstName + " " + guestInfo.lastName + "\nTischnummer: " + guestInfo.table + "\nTelefonnummer: " + guestInfo.cellphone + "\nAdresse: " + guestInfo.street + ", " + guestInfo.zip + " " + guestInfo.city,
      buttons: ['OK']
    })
    alert.present()

  }

  checkOut(id){
    console.log("starting Chekckouting")
    // define Check out Guest Cloud function
    const guestCheckOut = this.functions.httpsCallable('guestCheckOut')
    guestCheckOut({ uid: id }).then(() => {
      this.createToast("Ausgewählter benutzer wird nun ausgeloggt.", "Nutzer Checkout.")
      this.refresh()
    }).catch((err) => {
      this.createToast(err,"Fehler beim auschecken des Nutzers.")
      console.log(err)
    })
  }

  restQrGen(){
    this.router.navigate(['genqr', { gastroID: this.restInformations.restaurantID }])
  }

  restUsermanagemer(){
    this.router.navigate(['usermanager', { gastroID: this.restInformations.restaurantID }])
  }

  restSettings(){
    this.router.navigate(['rest-settings', { gastroID: this.restInformations.restaurantID }])
  }

  async createToast(msg, header){
    const toastMSG = await this.toast.create({
      header: header,
      message: msg,
      duration: 4000
    })

    toastMSG.present()
  }

  async createReport(){
    const allUserData: Array<any> = []
    allUserData.push(this.guestListActive)
    allUserData.push(this.guestListInActive)
    const modal = await this.modalController.create({
      component: DatePickerPage,
      componentProps: {
        userData: allUserData,
        restData: this.restInformations
      }
    })

    modal.present()

    //this.generateReport(new Date('05/23/2020 00:00'), new Date())
  }
}
