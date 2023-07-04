import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { JobofferService } from '../../services/joboffer.service';
import { Observable, Subscription } from 'rxjs';
import { JobOffer } from '../../ocupational-profile';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  statistics = [];
  isAnonymous = null;

  kaCodes = {
    AM: 'Analytics and Modeling',
    CP: 'Computing Platforms',
    CV: 'Cartography and Visualization',
    DA: 'Domain Applications',
    DC: 'Data Capture',
    DM: 'Data Management',
    FC: 'Foundational Concepts',
    GS: 'GIS& T and Society',
    KE: 'Knowledge Economy',
    PD: 'Programming and Development'
  };

  selectedOffer: JobOffer;
  currentUser: User = new User();

  @ViewChild('dangerModal') public dangerModal: ModalDirective;

  constructor(
    public jobOfferService: JobofferService,
    private userService: UserService,
    private route: ActivatedRoute,
    public afAuth: AngularFireAuth
  ) {
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        this.isAnonymous = user.isAnonymous;
        this.userService.getUserById(user.uid).subscribe(userDB => {
          this.currentUser = new User(userDB);
        });
      } else {
        this.isAnonymous = true;
      }
    });
  }

  ngOnInit() {
    this.getOccuProfileId();
  }

  getOccuProfileId(): void {
    const _id = this.route.snapshot.paramMap.get('name');
    this.jobOfferService
      .getJobOfferById(_id)
      .subscribe(offer => {
        if (offer) {
          offer.currency = offer.currency != null ? offer.currency : '€';
          this.selectedOffer = offer;
          this.calculateStatistics();
        }
      });
  }

  calculateStatistics() {
    if (this.selectedOffer) {
      const tempStats = {};
      let tempTotal = 0;
      this.selectedOffer.occuProf.knowledge.forEach(kn => {
        const code = kn.slice(1, 3);
        tempStats[code] !== undefined ? tempStats[code]++ : tempStats[code] = 1;
        tempTotal++;
      });
      Object.keys(tempStats).forEach(k => {
        const nameKA = k + ' - ' + this.kaCodes[k];
        this.statistics.push({ code: nameKA, value: Math.round(tempStats[k] * 100 / tempTotal) });
      });
    }
  }
}
