import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  loggedIn: boolean = false
  login: any        = {}
  restaurantList: Array<any> = []
  functions = firebase.app().functions('europe-west3')

  constructor(public alertController: AlertController, private router: Router) { }

  ngOnInit() {
    if(firebase.auth().currentUser) {
      this.loggedIn = true;
      this.fetchRestaurants()
    }
  }

  adminLogin(){
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
      firebase.auth().signInWithEmailAndPassword(this.login.email, this.login.password).then((usr) => {
        this.loggedIn = true;
        this.fetchRestaurants();
      })
    })
  }

  restSettings(){
    this.router.navigate(['rest-settings', { gastroID: "newRest" }])
  }

  restSpecificSettings(id){
    this.router.navigate(['rest-settings', { gastroID: id }])
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.fetchRestaurants()
    event.target.complete();
  }
  
  adminLogout(){
    firebase.auth().signOut().then(() => {
      this.loggedIn = false;
    })
    // LOGOUT !!!
  }

  fetchRestaurants(){
    this.restaurantList = []
    firebase.firestore().collection("restaurants").get().then((docs) => {
      docs.forEach(element => {
        let data = element.data()
        let rest = {
          restId: element.id,
          restName: data.restName,                
          restDescription: data.restDescription,  
          restCellphone: data.restCellphone,
          restAdmins: data.restAdmins,
          restEmployees: data.restEmployees,
          restState: data.restState,
          restClosingTime: data.restClosingTime,
          restEntryCreated: data.restEntryCreated
        }
        this.restaurantList.push(rest)
      });
      console.log(this.restaurantList)
    })
  }
}
