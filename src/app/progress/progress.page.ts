import {Component, inject} from '@angular/core'
import {PhotoService, PhotoWithDate} from '../services/photo.service'

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
})
export class ProgressPage {
  photoService = inject(PhotoService)

  constructor() {}

  getMonths(): string[] {
    const monthsSet = new Set<string>();

    for (const photo of this.photoService.photos) {
      const date = new Date(photo.date);
      const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      monthsSet.add(month);
    }

    return Array.from(monthsSet);
  }

  getPhotosByMonth(month: string): PhotoWithDate[] {
    return this.photoService.photos.filter(photo => {
      const date = new Date(photo.date);
      const photoMonth = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      return photoMonth === month;
    });
  }
}
