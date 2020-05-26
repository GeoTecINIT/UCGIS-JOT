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
  sortNameAsc = true;
  sortOrgAsc = true;
  sortUpdAsc = true;
  sortedBy = 'lastUpdated';

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

  sortBy(attr) {
  //  this.paginationLimitFrom = 0;
  //  this.paginationLimitTo = 6;
  //  this.currentPage = 0;
    switch (attr) {
      case 'name':
        this.sortNameAsc = !this.sortNameAsc;
        this.sortedBy = 'name';
        // tslint:disable-next-line:max-line-length
        this.filteredJobOffers.sort((a, b) => (a.occuProf.title.toLowerCase() > b.occuProf.title.toLowerCase()) ? this.sortNameAsc ? 1 : -1 : this.sortNameAsc ? -1 : 1);
        break;
      case 'lastUpdated':
        this.sortUpdAsc = !this.sortUpdAsc;
        this.sortedBy = 'lastUpdated';
        this.filteredJobOffers.sort((a, b) => (a.updatedAt > b.updatedAt) ? this.sortUpdAsc ? 1 : -1 : this.sortUpdAsc ? -1 : 1);
        break;
      case 'organization':
        this.sortOrgAsc = !this.sortOrgAsc;
        this.sortedBy = 'organization';
        // tslint:disable-next-line:max-line-length
        this.filteredJobOffers.sort((a, b) => (a.orgName.toLowerCase() > b.orgName.toLowerCase()) ? this.sortOrgAsc ? 1 : -1 : this.sortOrgAsc ? -1 : 1);
        break;
    }
  }
}
