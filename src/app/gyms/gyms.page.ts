import { Component, OnInit } from '@angular/core';
import { GymService } from '../services/gym.service';
import {Gym} from '../../models/IGym'

@Component({
  selector: 'app-gyms',
  templateUrl: './gyms.page.html',
  styleUrls: ['./gyms.page.scss'],
})
export class GymsPage implements OnInit {
  fitnessCenters: Gym[] = []
  constructor(private gymService: GymService) {}
  async ngOnInit() {
    try {
      const response: any = await this.gymService.getNearbyFitnessCenters()
      this.fitnessCenters = response.results
    } catch (error) {
      console.error('Error fetching fitness centers:', error)
    }
  }
}
