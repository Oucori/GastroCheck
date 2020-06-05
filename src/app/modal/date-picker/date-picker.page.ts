import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.page.html',
  styleUrls: ['./date-picker.page.scss'],
})
export class DatePickerPage implements OnInit {

  fromDate: Date 
  fromDatePlaceholder: String
  toDate: Date
  toDatePlaceholder: String
  pdfObj: any = null

  @Input() private userData: Array<any>
  @Input() private restData: any

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.fromDate = new Date()
    this.toDate = new Date()
    pdfmake.vfs = pdfFonts.pdfMake.vfs;
  }

  logDates(){
    console.log(this.fromDate)
    console.log(this.toDate)
  }

  dismissModal(){
    this.modalController.dismiss()
  }

  async generateReport(){
    this.fromDate = new Date(this.fromDate)
    this.toDate = new Date(this.toDate)

    let reportData: Array<any> = []
    this.userData.forEach(guestLists => {
      guestLists.forEach(element => {
        if (this.fromDate<element.checkedInTime.toDate() && (this.toDate.setDate(this.toDate.getDate() + 1))>element.checkedInTime.toDate()) {
          reportData.push(element)
        } 
      });
    });

    let pdfContent: Array<any> = []
    reportData.forEach(element => {
      pdfContent.push({text: "\n"})
      pdfContent.push({text: element.firstName + " " + element.lastName , style: "guestHeader"})
      pdfContent.push({text: "\nTisch: " + element.table})
      if(element.eMail)
        pdfContent.push({text: "EMail: " + element.eMail})

      if(element.cellphone)
        pdfContent.push({text: "Telefonnummer: " + element.cellphone})
      
      if(element.city && element.street && element.zip)
        pdfContent.push({text: "Adresse: " + element.street + ", " + element.zip + " " + element.city})
      
      if(element.symptoms == true)
        pdfContent.push({text: "Haushalt Symtomfrei: JA"})

      if(element.symptoms == false)
        pdfContent.push({text: "Haushalt Symtomfrei: NEIN"})

      
      pdfContent.push({text: "Von: " + element.checkedInTime.toDate().toLocaleDateString() + " " + element.checkedInTime.toDate().getUTCHours() + ":" + element.checkedInTime.toDate().getUTCMinutes() + "\nBis: " + element.checkedOutTime.toDate().toLocaleDateString()  + " " + element.checkedOutTime.toDate().getUTCHours() + ":" + element.checkedOutTime.toDate().getUTCMinutes(), style: "standart"})
    });

    this.getBase64fromImageURL("https://i.ibb.co/CM4FWCz/test.png").then((imgRef) => {
      var docDefinition = {
        content: [
          { image: imgRef, fit: [100,100] , style: "logo"},
          { text: "staysafecheckin.de", style: "staysafeWatermark"},
          { text: new Date().toLocaleDateString(), style: "date"},
          { text: '\nGäste Liste des Restaurants: ' + this.restData.restName + "\n ( " + this.fromDate.toLocaleDateString() + " - " + this.toDate.toLocaleDateString() + " )", style: "header" },
          { text: '\n\nIn diesem Dokument ist nun eine komplette auflistung aller Gäste,\ndie das Lokal "' + this.restData.restName + '" von dem ' + this.fromDate.toLocaleDateString() + " bis zu dem " + this.toDate.toLocaleDateString() + " besucht haben.\n\n Anbei stehen alle verfügbaren Daten in verbindung mit diesen Gästen. #staysafe\n", style: "standart"},
          { text: "\n"},
          pdfContent
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center'
          },
          guestHeader: {
            fontSize: 14,
            bold: false
          },
          standart: {
            fontSize: 12,
            bold: false
          },
          date: {
            fontSize: 11,
            bold: false,
            alignment: 'right'
          },
          staysafeWatermark: {
            fontSize: 8,
            bold: false,
            alignment: 'right'
          },
          logo: {
            margin: [0, -40, 0, -40],
            alignment: 'left'
          }
        }
      }
  
      this.pdfObj = pdfmake.createPdf(docDefinition)
    })
  }

  async openReport(){
    await this.generateReport()
    this.pdfObj.open()
  }

  async downloadReport(){
    await this.generateReport()
    this.pdfObj.download()  
  }

  getBase64fromImageURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }

  
}
