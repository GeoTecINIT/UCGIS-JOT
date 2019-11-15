import { Component, OnInit, Input } from '@angular/core';
import * as jsPDF from 'jspdf';
import { OcuprofilesService } from '../../services/ocuprofiles.service';
import { OcupationalProfile } from '../../ocupational-profile';
import { Base64img } from './base64img';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})

export class PopupComponent implements OnInit {

  constructor(private base64img: Base64img,
    public occuprofilesService: OcuprofilesService,
    private route: ActivatedRoute) { }

  public static END_PAGE_LINE = 284;

  @Input() idOP: any;
  selectedProfile: OcupationalProfile;

  ngOnInit() {
    this.getOccuProfileId();
  }

  getOccuProfileId(): void {
    this.occuprofilesService
      .getOccuProfileById(this.idOP)
      .subscribe(profile => {
        this.selectedProfile = profile;
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
    if (this.selectedProfile.title != null) {
      const titleLines = doc.setFontSize(38).splitTextToSize(this.selectedProfile.title, 150);
      doc.text(30, currentLinePoint, titleLines);
      currentLinePoint = currentLinePoint + (15 * titleLines.length);
    }

    if (this.selectedProfile.field != null) {
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'EQF' + this.selectedProfile.eqf + ' - ' + this.selectedProfile.field.name);
      currentLinePoint = currentLinePoint + 5;
    }

    if (this.selectedProfile.description != null) {
      doc.setTextColor('#000').setFontType('normal');
      const lines = doc.setFontSize(10).splitTextToSize(this.selectedProfile.description, 150);
      doc.text(30, currentLinePoint, lines); // description
      currentLinePoint = currentLinePoint + 10 + (4 * lines.length);
    }
    // fecha
    // const d = new Date();
    // doc.text(90, 90, d.toLocaleDateString('es-ES'));

    if (this.selectedProfile.knowledge.length > 0) {
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Knowledge required');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      this.selectedProfile.knowledge.forEach(kn => {
        const knTitle = kn.split('] ')[1];
        const knLines = doc.setFontSize(8).splitTextToSize('· ' + knTitle, 150);
        doc.text(30, currentLinePoint, knLines);
        currentLinePoint = currentLinePoint + 4 * knLines.length;
      });
    }

    if (this.selectedProfile.skills.length > 0) {
      currentLinePoint = currentLinePoint + 10;
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Skills required');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      this.selectedProfile.skills.forEach(sk => {
        const skTitle = sk.split('] ')[1];
        currentLinePoint = this.checkEndOfPage(currentLinePoint, doc);
        const skLines = doc.setFontSize(8).splitTextToSize('· ' + skTitle, 150);
        doc.text(30, currentLinePoint, skLines);
        currentLinePoint = currentLinePoint + 4 * skLines.length;
      });
    }

    if (this.selectedProfile.competences.length > 0) {
      currentLinePoint = currentLinePoint + 10;
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Transversal skills required');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      this.selectedProfile.competences.forEach(co => {
        currentLinePoint = this.checkEndOfPage(currentLinePoint, doc);
        const coLines = doc.setFontSize(8).splitTextToSize('· ' + co.preferredLabel, 150);
        doc.text(30, currentLinePoint, coLines);
        currentLinePoint = currentLinePoint + 4 * coLines.length;
      });
    }

    // doc.textWithLink('asdfasdf', 20, 260, { url: 'https://' });
    doc.save('OccupationalProfile.pdf');
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
