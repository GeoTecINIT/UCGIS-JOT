import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { OcupationalProfile } from '../ocupational-profile';

const collection = 'OcuProfiles';

@Injectable({
  providedIn: 'root'
})
export class OcuprofilesService {
  private db: AngularFirestore;
  constructor(db: AngularFirestore) {
    this.db = db;
  }

  subscribeToOccupationalProfiles(): Observable<OcupationalProfile[]> {
    return this.db.collection<OcupationalProfile>(collection).valueChanges();
  }

  getOccuProfileById(occuProfileId: string): Observable<OcupationalProfile> {
    return this.db
      .collection(collection)
      .doc<OcupationalProfile>(occuProfileId)
      .valueChanges();
  }

  addNewOccuProfile(newProfile: OcupationalProfile) {
    const id = this.db.createId();
    newProfile._id = id;
    this.db
      .collection(collection)
      .doc(id)
      .set(newProfile);
  }

  removeOccuProfile(occuProfileId: string) {
    this.db
      .collection(collection)
      .doc(occuProfileId)
      .delete();
  }

  updateOccuProfile(occuProfileId: string, updatedProfile: OcupationalProfile) {
    this.db
      .collection(collection)
      .doc<OcupationalProfile>(occuProfileId)
      .update(updatedProfile);
  }

  mergeOccuProfiles(op1: OcupationalProfile, op2: OcupationalProfile): OcupationalProfile {

    op1.title = op1.title + ' - ' + op2.title;
    op1.description = op1.description + ' \n\n ' + op2.title + ' \n ' + op2.description;
    if (op2.fields) {
      let found = false;
      op2.fields.forEach(f => {
        op1.fields.forEach( cc2 => {
          if ( cc2.name === f.name) {
            found = true;
          }
        });
        if (!found) {
          op1.fields.push( f );
        }
        found = false;
      });
    }
    if (op2.knowledge) {
      op2.knowledge.forEach(kn => {
        if (op1.knowledge.indexOf(kn) === -1) {
          op1.knowledge.push(kn);
        }
      });
    }
    if (op2.skills) {
      op2.skills.forEach(sk => {
        if (op1.skills.indexOf(sk) === -1) {
          op1.skills.push(sk);
        }
      });
    }
    if (op2.customSkills) {
      op2.customSkills.forEach(sk => {
        if (op1.customSkills.indexOf(sk) === -1) {
          op1.customSkills.push(sk);
        }
      });
    }
    if (op2.customCompetences) {
      op2.customCompetences.forEach(cc => {
        if (op1.customCompetences.indexOf(cc) === -1) {
          op1.customCompetences.push(cc);
        }
      });
    }
    if (op2.competences) {
      let found = false;
      op2.competences.forEach(cc => {
        op1.competences.forEach( cc2 => {
          if ( cc2.preferredLabel === cc.preferredLabel) {
            found = true;
          }
        });
        if (!found) {
          op1.competences.push( cc );
        }
        found = false;
      });
    }
    // op1.fields = op1.fields ? op2.fields ? op1.fields.concat(op2.fields) : op1.fields : [];
    // op1.knowledge = op1.knowledge.concat(op2.knowledge);
    // op1.skills = op1.skills.concat(op2.skills);
    // op1.customSkills = op1.customSkills.concat(op2.customSkills);
    // op1.customCompetences = op1.customCompetences.concat(op2.customCompetences);
    // op1.competences = op1.competences.concat(op2.competences);
    op1.eqf = op1.eqf > op2.eqf ? op1.eqf : op2.eqf;

    return op1;
  }
}
