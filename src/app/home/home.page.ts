import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage'
import { LoadingController, ToastController, IonCheckbox } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  currentTitle: string = "GastroCheck"
  currentUserId: string
  informations: any = {}
  currentMode: number = 0
  mandatoryFields = {
    name: false,
    symtomConfirmation: false,
    adress: false,
    cellphone: false,
    eMail: false,
    table: false,
    checkIn: false,
    checkOut: false,
    deletionTime: 0,
    submitButton: true
  }

  restData: any = {}

  functions = firebase.app().functions('europe-west3')

  constructor(
    private route: ActivatedRoute,
    private storage: Storage,
    public loadingController: LoadingController,
    private toast: ToastController
  ) {}

  
  ngOnInit() {
    this.currentUserId          = null
    this.route.queryParams.subscribe((params) => {
      if(params && params.gastroID && params.table ) {
        this.informations.gastroID  = params.gastroID
        this.informations.table     = params.table
        
      } else {
        // KEINE PARAMETER
      }
    })

    // Get the value of userId
    this.storage.get("userId").then((val) => {
      // if the value was found
      if(val){
        this.createToast("Mache da weiter wo du aufgehört hast...", "Sitzung wird fortgefahren")
        // se the current user ID to this value
        this.currentMode = 1
        this.currentUserId = val
        console.log(val)
        this.refresh()
      } else {
        // no id found
        // setup the formular based on state
        this.refresh()
        this.createToast("Herzlich Willkommen und vielen Dank das du dich einträgst... #staysafe", "Willkommen")
        // make the forumlar visible
        this.currentMode = 2
      }
    })
  }

  async checkOut(){
    const loading = await this.loadingController.create({
      message: 'Bitte warten...'
    });
    await loading.present();

    // define Check out Guest Cloud function
    const guestCheckOut = this.functions.httpsCallable('guestCheckOut')
    guestCheckOut({ uid: this.currentUserId }).then(() => {
      // set the user to checked out and return him back to the formular
      this.currentMode = 2
      // clear the key storage
      this.storage.clear()
      // setup the formular based on state
      this.refresh()
      loading.dismiss()
      this.createToast("Du hast dich erfolgreich ausgecheckt.", "Check out")
    }).catch((err) => {
      console.log(err)
      loading.dismiss()
      this.createToast(err, "Fehler beim Checkout.")
    })
  }

  // @argument data - firstName, lastName, email, cellphone, city, street, zip, gastroID, tableNr, deletionWeeks 
  async sendFormular(){
    let checkbox = document.getElementById('checkbox') as HTMLIonCheckboxElement
    if(!checkbox.checked) {
      this.createToast("Bitte akzeptieren sie die Datenschutzerklärung.", "Fehler beim formular absenden.")
      return
    }
    if(this.mandatoryFields.name && !(this.informations.firstName || this.informations.lastName)) {
      this.createToast("Bitte tragen sie einen Gültigen Namen ein.", "Fehler beim formular absenden.")
      return
    }
    if(this.mandatoryFields.symtomConfirmation && !(this.informations.symptoms)) {
      this.createToast("Selektieren sie was im feld 'Haushalt Symptomfrei ?'.", "Fehler beim formular absenden.")
      // Benachrichtigung
      return
    }
    if(this.mandatoryFields.adress && !(this.informations.street || this.informations.city || this.informations.zip)) {
      this.createToast("Bitte tragen sie ihre Adresse ein.", "Fehler beim formular absenden.")
      // Benachrichtigung
      return
    }
    if(this.mandatoryFields.cellphone && !(this.informations.cellphone)) {
      this.createToast("Bitte tragen sie einen Telefonnummer ein.", "Fehler beim formular absenden.")
      return
    }
    if(this.mandatoryFields.eMail && !(this.informations.eMail)) {
      this.createToast("Bitte tragen sie einen Gültigen E-Mail Adresse ein.", "Fehler beim formular absenden.")
      return
    }

    
    const loading = await this.loadingController.create({
      message: 'Bitte warten...'
    });
    await loading.present();

    this.informations.deletionWeeks = this.mandatoryFields.deletionTime
  
    firebase.auth().signInAnonymously().then(() => {
      const addGuest = this.functions.httpsCallable('addGuest')
      addGuest(this.informations).then(() => {
        this.storage.set("userId", firebase.auth().currentUser.uid).then(() => console.log("saved user"))
        this.currentUserId = firebase.auth().currentUser.uid
        this.currentMode = 1
        this.refresh()
        loading.dismiss()
        this.createToast("Vielen dank für ihr CheckIn, bitte vergessen sie nicht sich auszuchecken, diese seite können sie ruhig schließen.", "Checkin erfolgreich.")
        firebase.auth().currentUser.delete().catch((err) => {
          if(firebase.auth().currentUser){
            firebase.auth().currentUser = null
          }
          console.log(err)
        })
      }).catch((err) => {
        console.log(err)
        this.createToast(err, "Fehler Checkin.")
        loading.dismiss()
      })
    }).catch((err) => {
      console.log(err)
      this.createToast(err, "Fehler Checkin.")
      loading.dismiss()
    })
  }
  
  setFieldsBasedOnState(){
    switch (this.restData.restState) {
      case "BW": // Baden-Württemberg
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = true
        this.mandatoryFields.adress             = true
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 4
        break;
      case "BY": // Bayern
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = true
        this.mandatoryFields.adress             = false
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 4
        break;
      case "BE": // Berlin
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = false
        this.mandatoryFields.adress             = true
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = false
        this.mandatoryFields.checkOut           = false
        this.mandatoryFields.deletionTime       = 4 
        break;
      case "BB": // Brandenburg
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = true
        this.mandatoryFields.adress             = false
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 4 
        break;
      case "HB": // Bremen
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = false
        this.mandatoryFields.adress             = true
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 3 
        break;
      case "HH" || "RE" || "HE": // Hamburg, Hessen, Rheinland-Pfalz
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = false
        this.mandatoryFields.adress             = true
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = false
        this.mandatoryFields.checkOut           = false
        this.mandatoryFields.deletionTime       = 4
        break;
      case "MV": // Meklenburg-Vorpommern
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = false
        this.mandatoryFields.adress             = true
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = true
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 4
        break;
      case "NI": // Niedersachsen
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = false
        this.mandatoryFields.adress             = true
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 3
        break;
      case "NW": // Nordrhein-Westfalen
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = false//F
        this.mandatoryFields.adress             = true
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false//F
        this.mandatoryFields.table              = true
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 4
        break;
      case "SL": // Saarland
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = false
        this.mandatoryFields.adress             = true
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 4
        break;
      case "SN": // Sachsen
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = true
        this.mandatoryFields.adress             = false
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 4 
        break;
      case "ST": // Sachsen-Anhalt
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = false
        this.mandatoryFields.adress             = true
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = true
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 8
        break;
      case "SH": // Schleswig-Holstein
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = false
        this.mandatoryFields.adress             = true
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = true
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = false
        this.mandatoryFields.checkOut           = false
        this.mandatoryFields.deletionTime       = 46
        break;
      case "TH": // Thüringen
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = true
        this.mandatoryFields.adress             = false
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 4 
        break;      
      default:
        break;
    }
  }

  refresh(){
    const restaurant = firebase.firestore().collection('restaurants').doc(this.informations.gastroID)
    restaurant.get().then((data) => {
      const title = document.getElementById('title') as HTMLElement 
      title.innerHTML = data.data().restName
      console.log(data.data().restName)
      this.restData = data.data()

      this.setFieldsBasedOnState()
    }).catch((err) => { throw err })
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
