import { Component, OnInit, Input } from '@angular/core';
import * as jsPDF from 'jspdf';
import { JobofferService } from '../../services/joboffer.service';
import { OcupationalProfile, JobOffer } from '../../ocupational-profile';
import { Base64img } from './base64img';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})

export class PopupComponent implements OnInit {

  constructor(private base64img: Base64img,
    public jobOfferService: JobofferService,
    private route: ActivatedRoute) { }

  public static END_PAGE_LINE = 284;

  @Input() idOP: any;
  selectedJobOffer: JobOffer;

  ngOnInit() {
    this.getOccuProfileId();
  }

  getOccuProfileId(): void {
    this.jobOfferService
      .getJobOfferById(this.idOP)
      .subscribe(jo => {
        this.selectedJobOffer = jo;
      });
  }

  copyText() {
    let url = location.href;
    if (url.includes('list')) {
      url = url.replace('list', 'detail') + '/' + this.idOP;
    }
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  generatePDF() {
    let currentLinePoint = 45;
    // cabecera , imágenes
    const doc = new jsPDF();
    doc.addImage(this.base64img.logo, 'PNG', 10, 7, 37, 25);
    doc.addImage(this.base64img.back, 'PNG', 0, 100, 210, 198);
    doc.link(15, 15, 600, 33, { url: 'http://www.eo4geo.eu' });
    doc.setFontSize(38);
    doc.setFontType('bold');
    doc.setTextColor('#1a80b6');
    if (this.selectedJobOffer.occuProf.title != null) {
      const titleLines = doc.setFontSize(38).splitTextToSize(this.selectedJobOffer.occuProf.title, 150);
      doc.text(30, currentLinePoint, titleLines);
      currentLinePoint = currentLinePoint + (15 * titleLines.length);
    }

    if (this.selectedJobOffer.occuProf.field != null) {
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'EQF' + this.selectedJobOffer.occuProf.eqf + ' - ' + this.selectedJobOffer.occuProf.field.name);
      currentLinePoint = currentLinePoint + 5;
    }

    if (this.selectedJobOffer.occuProf.description != null) {
      doc.setTextColor('#000').setFontType('normal');
      const lines = doc.setFontSize(10).splitTextToSize(this.selectedJobOffer.occuProf.description, 150);
      doc.text(30, currentLinePoint, lines); // description
      currentLinePoint = currentLinePoint + 10 + (4 * lines.length);
    }
    // fecha
    // const d = new Date();
    // doc.text(90, 90, d.toLocaleDateString('es-ES'));

    if (this.selectedJobOffer.occuProf.knowledge.length > 0) {
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Knowledge required');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      this.selectedJobOffer.occuProf.knowledge.forEach(kn => {
        const knTitle = kn.split('] ')[1];
        const knLines = doc.setFontSize(8).splitTextToSize('· ' + knTitle, 150);
        doc.text(30, currentLinePoint, knLines);
        currentLinePoint = currentLinePoint + 4 * knLines.length;
      });
    }

    if (this.selectedJobOffer.occuProf.skills.length > 0) {
      currentLinePoint = currentLinePoint + 10;
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Skills required');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      this.selectedJobOffer.occuProf.skills.forEach(sk => {
        const skTitle = sk.split('] ')[1];
        currentLinePoint = this.checkEndOfPage(currentLinePoint, doc);
        const skLines = doc.setFontSize(8).splitTextToSize('· ' + skTitle, 150);
        doc.text(30, currentLinePoint, skLines);
        currentLinePoint = currentLinePoint + 4 * skLines.length;
      });
    }

    if (this.selectedJobOffer.occuProf.competences.length > 0) {
      currentLinePoint = currentLinePoint + 10;
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Transversal skills required');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      this.selectedJobOffer.occuProf.competences.forEach(co => {
        currentLinePoint = this.checkEndOfPage(currentLinePoint, doc);
        const coLines = doc.setFontSize(8).splitTextToSize('· ' + co.preferredLabel, 150);
        doc.text(30, currentLinePoint, coLines);
        currentLinePoint = currentLinePoint + 4 * coLines.length;
      });
    }

    if (this.selectedJobOffer.languages.length > 0) {
      currentLinePoint = currentLinePoint + 10;
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Languages');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      this.selectedJobOffer.languages.forEach(lan => {
        currentLinePoint = this.checkEndOfPage(currentLinePoint, doc);
        const coLines = doc.setFontSize(8).splitTextToSize('· ' + lan.name, 150);
        doc.text(30, currentLinePoint, coLines);
        currentLinePoint = currentLinePoint + 4 * coLines.length;
      });
    }

    if (this.selectedJobOffer.location !== '') {
      currentLinePoint = currentLinePoint + 10;
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Location');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      currentLinePoint = this.checkEndOfPage(currentLinePoint, doc);
      const coLines = doc.setFontSize(8).splitTextToSize( this.selectedJobOffer.location, 150);
      doc.text(30, currentLinePoint, coLines);
      currentLinePoint = currentLinePoint + 4 * coLines.length;
    }

    if (this.selectedJobOffer.dedication !== '') {
      currentLinePoint = currentLinePoint + 10;
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Dedication');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      currentLinePoint = this.checkEndOfPage(currentLinePoint, doc);
      const coLines = doc.setFontSize(8).splitTextToSize(this.selectedJobOffer.dedication, 150);
      doc.text(30, currentLinePoint, coLines);
      currentLinePoint = currentLinePoint + 4 * coLines.length;
    }

    if (this.selectedJobOffer.typeContract !== '') {
      currentLinePoint = currentLinePoint + 10;
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Type of contract');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      currentLinePoint = this.checkEndOfPage(currentLinePoint, doc);
      const coLines = doc.setFontSize(8).splitTextToSize( this.selectedJobOffer.typeContract, 150);
      doc.text(30, currentLinePoint, coLines);
      currentLinePoint = currentLinePoint + 4 * coLines.length;
    }

    if (this.selectedJobOffer.salaryMax !== 0) {
      currentLinePoint = currentLinePoint + 10;
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Annual Salary Range');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      currentLinePoint = this.checkEndOfPage(currentLinePoint, doc);
      // tslint:disable-next-line:max-line-length
      const coLines = doc.setFontSize(8).splitTextToSize('Min: ' + this.selectedJobOffer.salaryMin + ' - Max: ' + this.selectedJobOffer.salaryMax, 150);
      doc.text(30, currentLinePoint, coLines);
      currentLinePoint = currentLinePoint + 4 * coLines.length;
    }

    if (this.selectedJobOffer.motivationLetter) {
      currentLinePoint = currentLinePoint + 10;
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Requires motivation letter');
      currentLinePoint = currentLinePoint + 5;
    }

    if (this.selectedJobOffer.additionalQuestions.length > 0 ) {
      currentLinePoint = currentLinePoint + 10;
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Additional questions');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      currentLinePoint = this.checkEndOfPage(currentLinePoint, doc);
      // tslint:disable-next-line:max-line-length
      const coLines = doc.setFontSize(8).splitTextToSize( this.selectedJobOffer.additionalQuestions , 150);
      doc.text(30, currentLinePoint, coLines);
      currentLinePoint = currentLinePoint + 4 * coLines.length;
    }

    // doc.textWithLink('asdfasdf', 20, 260, { url: 'https://' });
    doc.save('Job Offer.pdf');
  }


  checkEndOfPage(line, doc) {
    if (line > PopupComponent.END_PAGE_LINE) {
      doc.addPage();
      doc.addImage(this.base64img.logo, 'PNG', 10, 7, 37, 25);
      doc.addImage(this.base64img.back, 'PNG', 0, 100, 210, 198);
      line = 45;
    }
    return line;
  }

}
