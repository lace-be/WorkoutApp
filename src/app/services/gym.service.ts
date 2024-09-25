import {Injectable} from '@angular/core'
import {Geolocation} from '@capacitor/geolocation'
import {environment} from '../../environments/environment'
import {Http} from '@capacitor-community/http'
import {Gym, GymResponse} from '../../models/IGym'

@Injectable({
  providedIn: 'root'
})
export class GymService {
  constructor() {
  }

  async getCurrentPosition() {
    return await Geolocation.getCurrentPosition()
  }

  async getNearbyFitnessCenters(): Promise<GymResponse> {
    const coordinates = await this.getCurrentPosition()
    const lat = coordinates.coords.latitude
    const lng = coordinates.coords.longitude
    console.log(`Latitude: ${lat}, Longitude: ${lng}`)

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=100000&types=gym&name=gym&key=${environment.googleApiKey}`

    const response = await Http.request({
      method: 'GET',
      url: url,
      headers: {},
      params: {},
    })
    return response.data as GymResponse
  }
}
