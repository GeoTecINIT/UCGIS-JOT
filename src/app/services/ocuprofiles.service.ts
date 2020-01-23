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
    op1.description = op1.description + ' \n ' + op2.title + ' \n ' + op2.description;
    op1.fields = op1.fields ? op2.fields ? op1.fields.concat(op2.fields) : op1.fields : [];
    op1.knowledge = op1.knowledge.concat(op2.knowledge);
    op1.skills = op1.skills.concat(op2.skills);
    op1.customSkills = op1.customSkills.concat(op2.customSkills);
    op1.customCompetences = op1.customCompetences.concat(op2.customCompetences);
    op1.competences = op1.competences.concat(op2.competences);
    op1.eqf = op1.eqf > op2.eqf ? op1.eqf : op2.eqf;

    return op1;
  }
}
