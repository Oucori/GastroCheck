import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';

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

  constructor(public alertController: AlertController, private router: Router, public modalController: ModalController) { }

  ngOnInit() {
    if(this.loggedIn){
      this.refresh()
    }
    
  }

  employeeLogin(){
    firebase.auth().signInWithEmailAndPassword(this.loginInformations.email, this.loginInformations.password).then((usr) => {
      this.loggedIn = true;
      this.refresh()
    })
  }

  fetchRestaurantData(){
    const restaurant = firebase.firestore().collection('restaurants')
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
    this.guestListActive = new Array
    this.guestListInActive = new Array
    const guest = firebase.firestore().collection('guests')
    this.restInformations.restActiveGuests.forEach(element => {
      guest.doc(element).get().then((data) => {
        let guestData = data.data()
        guestData.id = element
        this.guestListActive.push(guestData)
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
      this.refresh()
      console.log("done checkouting")
    }).catch((err) => {
      console.log(err)
    })
  }

  restSettings(){
    console.log(this.restInformations.restaurantID)
    this.router.navigate(['rest-settings', { gastroID: this.restInformations.restaurantID }])
  }
}
