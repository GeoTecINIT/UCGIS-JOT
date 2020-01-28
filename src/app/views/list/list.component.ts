import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { NgForOf } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { JobOffer } from '../../ocupational-profile';
import { JobofferService } from '../../services/joboffer.service';
import { FormControl } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService, User } from '../../services/user.service';
import { OrganizationService } from '../../services/organization.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  jobOffers: JobOffer[];
  advancedSearch = false;
  filteredJobOffers: any[];
  searchText: string;
  knowledgeFilter: Boolean = true;
  skillFilter: Boolean = true;
  competencesFilter: Boolean = true;
  isAnonymous = null;
  currentUser: User = new User();

  @ViewChild('dangerModal') public dangerModal: ModalDirective;

  constructor(private jobOfferService: JobofferService,
    private userService: UserService,
    public organizationService: OrganizationService,
    public afAuth: AngularFireAuth) {
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        this.isAnonymous = user.isAnonymous;
        this.userService.getUserById(user.uid).subscribe(userDB => {
          this.currentUser = new User(userDB);

          this.jobOfferService
            .subscribeToJobOffers()
            .subscribe(jobOffers => {
              this.jobOffers = [];
              jobOffers.forEach(jo => {
                if (jo.isPublic) {
                  this.jobOffers.push(jo);
                } else if (this.currentUser && this.currentUser.organizations && this.currentUser.organizations.indexOf(jo.orgId) > -1) {
                  this.jobOffers.push(jo);
                }
              });
              this.filteredJobOffers = this.jobOffers;
            });
        });
      } else {
        this.isAnonymous = true;
      }
      this.jobOfferService
        .subscribeToJobOffers()
        .subscribe(jobOffers => {
          this.jobOffers = [];
          jobOffers.forEach(jo => {
            if (jo.isPublic) {
              this.jobOffers.push(jo);
            }
          });
          this.filteredJobOffers = this.jobOffers;
        });
    });
  }

  ngOnInit() {
  }

  removeJobOffer(id: string) {
    this.jobOfferService.removeJobOffer(id);
  }

  filter() {
    const search = this.searchText.toLowerCase();
    this.filteredJobOffers = [];
    this.filteredJobOffers = this.jobOffers.filter(
      it =>
        it.occuProf.title.toLowerCase().includes(search) ||
        it.occuProf.description.toLowerCase().includes(search)
    );
    if (this.advancedSearch) {
      this.applyFilters();
    }
  }

  applyFilters() {
    this.jobOffers.forEach(jo => {
      if (this.knowledgeFilter) {
        jo.occuProf.knowledge.forEach(know => {
          if (know.toLowerCase().includes(this.searchText.toLowerCase())) {
            if (this.filteredJobOffers.indexOf(jo) === -1) {
              this.filteredJobOffers.push(jo);
            }
          }
        });
      }
      if (this.skillFilter) {
        jo.occuProf.skills.forEach(ski => {
          if (ski.toLowerCase().includes(this.searchText.toLowerCase())) {
            if (this.filteredJobOffers.indexOf(jo) === -1) {
              this.filteredJobOffers.push(jo);
            }
          }
        });
      }
      if (this.competencesFilter) {
        jo.occuProf.competences.forEach(comp => {
          if (comp.preferredLabel.toLowerCase().includes(this.searchText.toLowerCase())) {
            if (this.filteredJobOffers.indexOf(jo) === -1) {
              this.filteredJobOffers.push(jo);
            }
          }
        });
      }
    });
  }
}
