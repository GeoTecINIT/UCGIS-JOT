import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Organization, OrganizationService } from '../../services/organization.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-organization',
  templateUrl: 'organizationdetails.component.html'
})
export class OrganizationDetailsComponent implements OnInit {

  public currentOrg: Organization = null;
  isAnonymous = null;

  return = '';

  constructor(
    private afAuth: AngularFireAuth,
    private organizationService: OrganizationService,
    private route: ActivatedRoute
  ) {
    // Load users
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        this.isAnonymous = user.isAnonymous;
      } else {
        this.isAnonymous = true;
      }
    });
    this.getOrgWithId();
  }

  ngOnInit() {
  }

  getOrgWithId(): void {
    const _id = this.route.snapshot.paramMap.get('name');
    this.organizationService
      .getOrganizationById(_id)
      .subscribe(org => {
        this.currentOrg = org;
      });
  }
}
