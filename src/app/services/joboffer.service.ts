import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { OcupationalProfile, JobOffer } from '../ocupational-profile';

const collection = 'JobOffers';

@Injectable({
  providedIn: 'root'
})
export class JobofferService {
  private db: AngularFirestore;
  constructor(db: AngularFirestore) {
    this.db = db;
  }

  subscribeToJobOffers(): Observable<JobOffer[]> {
    return this.db.collection<JobOffer>(collection).valueChanges();
  }

  getJobOfferById(jobOfferId: string): Observable<JobOffer> {
    return this.db
      .collection(collection)
      .doc<JobOffer>(jobOfferId)
      .valueChanges();
  }

  addNewJobOffer(newJobOffer: JobOffer) {
    const id = this.db.createId();
    newJobOffer._id = id;
    this.db
      .collection(collection)
      .doc(id)
      .set(newJobOffer);
  }

  removeJobOffer(jobOfferId: string) {
    this.db
      .collection(collection)
      .doc(jobOfferId)
      .delete();
  }

  updateJobOffer(jobOfferId: string, updatedJobOffer: JobOffer) {
    this.db
      .collection(collection)
      .doc<OcupationalProfile>(jobOfferId)
      .update(updatedJobOffer);
  }
}
