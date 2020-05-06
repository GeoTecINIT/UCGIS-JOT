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
  getSubjectMetadata() {
    // <#> dc:hasPart [ dc:extent "2" ; dc:relation eo4geo:someBoKConcept  ] ;
    // @prefix dc: <http://purl.org/dc/terms/> .
    // @prefix eo4geo: <http://bok.eo4geo.eu/> .
    // <> dc:hasPart [ dc:type "Module";
    // dc:title "Mathematics";
    // dc:relation eo4geo:AM;
    // dc:relation eo4geo:GC] .
    let subject = '@prefix dc: <http://purl.org/dc/terms/> . @prefix eo4geo: <http://bok.eo4geo.eu/> . ';
    if (this.selectedJobOffer.occuProf.knowledge && this.selectedJobOffer.occuProf.knowledge.length > 0) {
      subject = subject + '<> dc:hasPart [ dc:type "Job Offer"; dc:title "' + this.selectedJobOffer.occuProf.title + '"';
      this.selectedJobOffer.occuProf.knowledge.forEach(know => {
        // const bokCode = concept.split('] ')[1];
        const bokCode = know.split(']', 1)[0].split('[', 2)[1];
        if (bokCode) {
          subject = subject + '; dc:relation eo4geo:' + bokCode;
        }
      });
      subject = subject + '  ] .';
    }
    return subject;
  }

  generatePDF() {
    let currentLinePoint = 45;
    // cabecera , imágenes
    const doc = new jsPDF();
    doc.setProperties({
      title: this.selectedJobOffer.occuProf.title,
      subject: this.getSubjectMetadata(),
      author: 'EO4GEO',
      keywords: 'eo4geo, job offer tool',
      creator: 'Job Offer Tool'
    });
    doc.addImage(this.base64img.logo, 'PNG', 10, 7, 37, 25);
    doc.addImage(this.base64img.back, 'PNG', 0, 100, 210, 198);
    doc.link(15, 15, 600, 33, { url: 'http://www.eo4geo.eu' });
    doc.setFontSize(38);
    doc.setFontType('bold');
    doc.setTextColor('#1a80b6');
    if (this.selectedJobOffer.occuProf.title != null) {
      const titleLines = doc.setFontSize(38).splitTextToSize(this.selectedJobOffer.occuProf.title, 150);
      doc.text(30, currentLinePoint, titleLines);
      // tslint:disable-next-line:max-line-length
      doc.link(15, currentLinePoint - 5, 600, currentLinePoint, { url: 'https://eo4geo-jot.web.app/' });
      currentLinePoint = currentLinePoint + (15 * titleLines.length);
    }

    if (this.selectedJobOffer.orgName != null) {
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, this.selectedJobOffer.orgName);
      // draw a line
      // const textWidth = doc.getTextWidth(this.selectedJobOffer.orgName);
      // doc.line(30, currentLinePoint, textWidth, currentLinePoint);
      currentLinePoint = currentLinePoint + 8;
    }

    doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
    doc.text(30, currentLinePoint, 'EQF' + this.selectedJobOffer.occuProf.eqf);
    currentLinePoint = currentLinePoint + 5;
    if (this.selectedJobOffer.occuProf.fields != null) {
      this.selectedJobOffer.occuProf.fields.forEach(f => {
        doc.text(30, currentLinePoint, f.name + ' (' + f.grandparent + ')');
        currentLinePoint = currentLinePoint + 5;
      });
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

    if (this.selectedJobOffer.occuProf.knowledge && this.selectedJobOffer.occuProf.knowledge.length > 0) {
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Knowledge required');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      this.selectedJobOffer.occuProf.knowledge.forEach(kn => {
        const knTitle = kn.split('] ').length > 1 ? kn.split('] ')[1] : kn ;
        const knLines = doc.setFontSize(8).splitTextToSize('· ' + knTitle, 150);
        doc.text(30, currentLinePoint, knLines);
        currentLinePoint = currentLinePoint + 4 * knLines.length;
      });
    }

    if (this.selectedJobOffer.occuProf.skills && this.selectedJobOffer.occuProf.skills.length > 0) {
      currentLinePoint = currentLinePoint + 10;
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Skills required');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      this.selectedJobOffer.occuProf.skills.forEach(sk => {
        const skTitle = sk.split('] ').length > 1 ? sk.split('] ')[1] : sk;
        currentLinePoint = this.checkEndOfPage(currentLinePoint, doc);
        const skLines = doc.setFontSize(8).splitTextToSize('· ' + skTitle, 150);
        doc.text(30, currentLinePoint, skLines);
        currentLinePoint = currentLinePoint + 4 * skLines.length;
      });
    }

    if (this.selectedJobOffer.occuProf.competences && this.selectedJobOffer.occuProf.competences.length > 0) {
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

    if (this.selectedJobOffer.dataRequired && this.selectedJobOffer.dataRequired.length > 0) {
      currentLinePoint = currentLinePoint + 10;
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Datasets required');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      this.selectedJobOffer.dataRequired.forEach(da => {
        currentLinePoint = this.checkEndOfPage(currentLinePoint, doc);
        const coLines = doc.setFontSize(8).splitTextToSize('· ' + da.name, 150);
        doc.text(30, currentLinePoint, coLines);
        currentLinePoint = currentLinePoint + 4 * coLines.length;
      });
    }

    if (this.selectedJobOffer.toolsRequired && this.selectedJobOffer.toolsRequired.length > 0) {
      currentLinePoint = currentLinePoint + 10;
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Tools required');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      this.selectedJobOffer.toolsRequired.forEach(tool => {
        currentLinePoint = this.checkEndOfPage(currentLinePoint, doc);
        const coLines = doc.setFontSize(8).splitTextToSize('· ' + tool.name, 150);
        doc.text(30, currentLinePoint, coLines);
        currentLinePoint = currentLinePoint + 4 * coLines.length;
      });
    }

    if (this.selectedJobOffer.languages && this.selectedJobOffer.languages.length > 0) {
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
      const coLines = doc.setFontSize(8).splitTextToSize(this.selectedJobOffer.location, 150);
      doc.text(30, currentLinePoint, coLines);
      currentLinePoint = currentLinePoint + 4 * coLines.length;
    }

    if (this.selectedJobOffer.yearsExperience != null) {
      currentLinePoint = currentLinePoint + 10;
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Years of experience');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      currentLinePoint = this.checkEndOfPage(currentLinePoint, doc);
      const coLines = doc.setFontSize(8).splitTextToSize(this.selectedJobOffer.yearsExperience + '', 150);
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
      const coLines = doc.setFontSize(8).splitTextToSize(this.selectedJobOffer.typeContract, 150);
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

    if (this.selectedJobOffer.additionalQuestions && this.selectedJobOffer.additionalQuestions.length > 0) {
      currentLinePoint = currentLinePoint + 10;
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Additional questions');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      currentLinePoint = this.checkEndOfPage(currentLinePoint, doc);
      // tslint:disable-next-line:max-line-length
      const coLines = doc.setFontSize(8).splitTextToSize(this.selectedJobOffer.additionalQuestions, 150);
      doc.text(30, currentLinePoint, coLines);
      currentLinePoint = currentLinePoint + 4 * coLines.length;
    }

    // doc.textWithLink('asdfasdf', 20, 260, { url: 'https://' });
    doc.save(this.selectedJobOffer.occuProf.title + '.pdf');
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

    getCompetences ( data: any ) {
        let resultCompetences = '';
        data.competences.forEach( competence => {
            resultCompetences = resultCompetences + '<rdf:li>' +
                '<rdf:Description rdf:about="' + competence.uri  + '">' +
                '<esco:skillType>' + competence.skillType + '</esco:skillType>' +
                '<esco:reuseLevel>' + competence.reuseLevel + '</esco:reuseLevel>' +
                '<esco:preferredLabel>' + competence.preferredLabel + '</esco:preferredLabel>' +
                '<esco:description>' + competence.description + '</esco:description>' +
                '</rdf:Description>' + ' </rdf:li>';
        });
        return resultCompetences;
    }

    getCustomCompetences ( data: any ) {
        let resultCompetences = '';
        data.customCompetences.forEach( competence => {
            resultCompetences = resultCompetences + '<rdf:li>' + competence + ' </rdf:li>';
        });
        return resultCompetences;
    }

    getFields ( data: any ) {
        let resultFields = '';
            resultFields = resultFields + '<rdf:li>' + data.field.greatgrandparent + ' </rdf:li>' +
                '<rdf:li>' + data.field.code + ' </rdf:li>' +
                '<rdf:li>' + data.field.grandparent + ' </rdf:li>' +
                '<rdf:li>' + data.field.name + ' </rdf:li>' +
                '<rdf:li>' + data.field.concatName + ' </rdf:li>' +
                '<rdf:li>' + data.field.parent + ' </rdf:li>';
        return resultFields;
    }

    getKnowledge ( data: any ) {
        const occPro = 'https://eo4geo-opt.web.app/#/detail/';
        let resultKnowledges = '';
        data.knowledge.forEach( know => {
            resultKnowledges = resultKnowledges + '<rdf:li>' +
                '<rdf:Description rdf:about="' + occPro + '">' +
                '<know:knowledge>' + know + '</know:knowledge>' +
                '</rdf:Description>' + ' </rdf:li>';
        });
        return resultKnowledges;
    }

    getSkills ( data: any ) {
        const urlSkills = 'https://eo4geo-opt.web.app/#/detail/';
        let resultSkills = '';
        data.skills.forEach( skill => {
            resultSkills = resultSkills + '<rdf:li>' +
                '<rdf:Description rdf:about="' + urlSkills + skill.split(']', 1)[0].split('[', 2)[1] + '">' +
                '<skill:skill>' + skill + '</skill:skill>' +
                '</rdf:Description>' + ' </rdf:li>';
        });
        return resultSkills;
    }
    getAdditionalQuestions ( data: any ) {
        let resultQuestions = '';
        data.additionalQuestions.forEach( question => {
            resultQuestions = resultQuestions + '<rdf:li>' + question + ' </rdf:li>';
        });
        return resultQuestions;
    }
    getLanguages ( data: any ) {
        let resultLanguages = '';
        data.languages.forEach( language => {
            resultLanguages = resultLanguages + '<rdf:li>' + language + ' </rdf:li>';
        });
        return resultLanguages;
    }
    getOccupationProfiles(data: any) {
        const urlOCP = 'https://eo4geo-opt.web.app/#/detail/';
        const competences = this.getCompetences(data);
        const fields = this.getFields( data);
        const knowledge = this.getKnowledge( data );
        const skills = this.getSkills( data );
        const customCompetences = this.getCustomCompetences(data);
        const occupationProfile = '<rdf:li> <rdf:Description ' +
            'rdf:about="' + urlOCP + data._id + '">' +
            '<occPro:title>' + data.title + '</occPro:title>' +
            '<occPro:description>' + data.description + '</occPro:description>' +
            '<occPro:eqf>' + data.eqf + '</occPro:eqf>' +
            '<occPro:orgName>' + data.orgName + '</occPro:orgName>' +
            '<occPro:competences> <rdf:Bag rdf:ID="competences">' + competences + '</rdf:Bag> </occPro:competences>' +
            '<occPro:customCompetences> <rdf:Bag rdf:ID="customCompetences">' + customCompetences +
            '</rdf:Bag> </occPro:customCompetences>' +
            '<occPro:fields> <rdf:Bag rdf:ID="fields">' + fields + '</rdf:Bag> </occPro:fields>' +
            '<occPro:knowleges> <rdf:Bag rdf:ID="knowledge">' + knowledge + '</rdf:Bag> </occPro:knowleges>' +
            '<occPro:skills> <rdf:Bag rdf:ID="skills">' + skills + '</rdf:Bag> </occPro:skills>' +
            '</rdf:Description> </rdf:li>';
        return occupationProfile;
    }
    headerRDF(data: any) {
        const urlBase = 'https://eo4geo-jot.web.app/#/detail/';
        const esco = 'http://data.europa.eu/esco/skill/';
        const occPro = 'https://eo4geo-opt.web.app/#/detail/';
        const knowledges = 'https://eo4geo-opt.web.app/#/detail/';
        const urlSkills = 'https://eo4geo-opt.web.app/#/detail/';
        return '<?xml version="1.0"?>' +
            '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"' +
            ' xmlns:esco="' + esco + '" ' +
            ' xmlns:know="' + knowledges + '" ' +
            ' xmlns:skill="' + urlSkills + '" ' +
            ' xmlns:occPro="' + occPro + '" ' +
            ' xmlns:jot="' + urlBase + '">' +
            ' <rdf:Description ' +
            'rdf:about="' + urlBase + data._id + '">';
    }
    createRDFFile(data: any) {
        const header = this.headerRDF(data);
        const description = '<jot:occupationProfile> <rdf:Bag rdf:ID="occupationProfile"> ' + this.getOccupationProfiles(data.occuProf) +
            '</rdf:Bag> </jot:occupationProfile>' +
            '<jot:additionalQuestions> <rdf:Bag rdf:ID="additionalQuestions"> ' + this.getAdditionalQuestions(data) + '</rdf:Bag> </jot:additionalQuestions>' +
            '<jot:languages> <rdf:Bag rdf:ID="languages"> ' + this.getLanguages(data) + ' </rdf:Bag> </jot:languages>' +
            '<jot:dedication> ' + data.dedication + '</jot:dedication>' +
            '<jot:isPublic> ' + data.isPublic + '</jot:isPublic>' +
            '<jot:location> ' + data.location + '</jot:location>' +
            '<jot:motivationLetter> ' + data.motivationLetter + '</jot:motivationLetter>' +
            '<jot:orgName> ' + data.orgName + '</jot:orgName>' +
            '<jot:salaryMax> ' + data.salaryMax + '</jot:salaryMax>' +
            '<jot:salaryMin> ' + data.salaryMin + '</jot:salaryMin>' +
            '<jot:typeContract> ' + data.typeContract + '</jot:typeContract>' +
            '</rdf:Description>';
        return header +
            description +
            '</rdf:RDF>';
    }
    generateRDF() {
        const data = this.createRDFFile(this.selectedJobOffer);
        const a = document.createElement('a');
        const blob = new Blob([data], {type: 'text/csv' }),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = this.selectedJobOffer.occuProf.title + '_rdf.rdf';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
}
