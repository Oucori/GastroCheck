import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AlertController } from '@ionic/angular';

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

  constructor(public alertController: AlertController) { }

  ngOnInit() {
  }

  adminLogin(){
    firebase.auth().signInWithEmailAndPassword(this.login.email, this.login.password).then((usr) => {
      this.loggedIn = true;
      this.fetchRestaurants();
    })
  }

  async openAddRestaurantForm(){
    const alert = await this.alertController.create({
      header: 'Füge ein Restaurant hinzu !',
      inputs: [
        {
          name: 'restName',
          type: 'text',
          placeholder: 'Restaurant Name'
        },
        {
          name: 'restDescription',
          type: 'textarea',
          placeholder: 'Restaurant Beschreibung.'
        },
        {
          name: 'restCellphone',
          type: 'number',
          placeholder: 'Restaurant Telefonnummer.'
        },
        {
          name: 'restTables',
          type: 'number',
          placeholder: 'Tische insgesammt.'
        },
        {
          name: 'restState',
          type: 'text',
          placeholder: 'Bundesland kürzel.'
        },
        {
          name: 'restClosingTime',
          type: 'text',
          placeholder: 'Ladenschluss ( 17:00 / 18:00 ... ).'
        },
        {
          name: 'restAdminId',
          type: 'text',
          placeholder: 'Admin ID.'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            this.addRestaurant(data.restName, data.restDescription, data.restCellphone, data.restTables, data.restState, data.restClosingTime, data.restAdminId)
          }
        }
      ]
    });

    await alert.present();
  }

  addRestaurant(restName, restDescription, restCellphone, restTables, restState, restClosingTime, restAdminId){
    const addNewRestaurant = this.functions.httpsCallable('addNewRestaurant')
    addNewRestaurant({ restName: restName, restDescription: restDescription, restCellphone: restCellphone, restTables: restTables, restState: restState, restClosingTime: restClosingTime, restAdminId: restAdminId }).then(() => {
      console.log("sucess")
      this.fetchRestaurants()
    }).catch((err) => {
      console.log(err)
    })
  }

  fetchRestaurants(){
    firebase.firestore().collection("restaurants").get().then((docs) => {
      docs.forEach(element => {
        let data = element.data()
        let rest = {
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
