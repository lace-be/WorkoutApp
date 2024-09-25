import {inject, Injectable} from '@angular/core'
import {Camera, Photo, PermissionStatus, CameraSource, CameraResultType} from '@capacitor/camera'
import {Preferences} from '@capacitor/preferences'
import {Capacitor} from '@capacitor/core'
import {ErrorService} from './error.service'
import {Directory, Filesystem} from '@capacitor/filesystem'
export interface PhotoWithDate extends Photo {
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  readonly photos: PhotoWithDate[] = []
  readonly #storageKey = 'photos'

  #photoURIs: string[] = []
  #errorService = inject(ErrorService)
  #permissionGranted: PermissionStatus = {camera: 'granted', photos: 'granted'}

  constructor() {
    this.#loadData().then(() => console.log('Data loaded'))
  }

  async #loadData() {
    await this.#retrievePhotoURIs()
    await this.#retrievePermissions()
    await this.#loadPhotos()
  }

  async #loadPhotos(): Promise<void> {
    for (const uri of this.#photoURIs) {
      const data = await Filesystem.readFile({ path: uri })

      const format = this.#getPhotoFormat(uri)
      this.photos.push({
        dataUrl: `data:image/${format};base64,${data.data}`,
        format,
        path: uri,
        saved: false,
        date: this.#getPhotoDate(uri)
      })
    }
  }

  #getPhotoFormat(uri: string): string {
    const splitUri = uri.split('.')
    return splitUri[splitUri.length - 1]
  }

  async #saveImageToFileSystem(photo: Photo): Promise<string> {
    if (!photo.base64String) {
      throw new Error('No photo data available')
    }

    const fileName = `${new Date().getTime()}.${photo.format}`
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: photo.base64String,
      directory: Directory.Data,
    })
    return savedFile.uri
  }

  async takePhoto(): Promise<void> {
    if (!this.#haveCameraPermission() || !this.#havePhotosPermission()) {
      await this.#requestPermissions()
    }

    if (!this.#haveCameraPermission() || !this.#havePhotosPermission()) {
      this.#errorService.enqueueErrorMessage(`Can't take a photo because the right to do so has not been granted.`)
      return
    }

    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Base64,
      source: this.#determinePhotoSource(),
    })

    const uri = await this.#saveImageToFileSystem(image)
    this.#photoURIs.push(uri)
    image.path = uri
    this.#persistPhotoURIs().then()

    image.dataUrl = `data:image/${image.format};base64,${image.base64String}`
    this.photos.push({
      ...image,
      date: new Date().toISOString()
    } as PhotoWithDate)
  }

  async #requestPermissions(): Promise<void> {
    try {
      this.#permissionGranted = await Camera.requestPermissions({permissions: ['photos', 'camera']})
    } catch (error) {
      console.error(`Permissions aren't available on this device: ${Capacitor.getPlatform()} platform.`)
    }
  }

  #determinePhotoSource(): CameraSource {
    if (!Capacitor.isNativePlatform()) {
      return CameraSource.Camera
    }

    if (this.#havePhotosPermission() && this.#haveCameraPermission()) {
      return CameraSource.Prompt
    } else {
      return this.#havePhotosPermission() ?
        CameraSource.Photos : CameraSource.Camera
    }
  }

  #haveCameraPermission(): boolean {
    return this.#permissionGranted.camera === 'granted'
  }

  #havePhotosPermission(): boolean {
    return this.#permissionGranted.photos === 'granted'
  }

  async #retrievePermissions(): Promise<void> {
    try {
      this.#permissionGranted = await Camera.checkPermissions()
    } catch (error) {
      console.error(`Permissions aren't available on this device: ${Capacitor.getPlatform()} platform.`)
    }
  }

  async #retrievePhotoURIs(): Promise<void> {
    const {value} = await Preferences.get({key: this.#storageKey})
    this.#photoURIs = value ? JSON.parse(value) : []
  }

  async #persistPhotoURIs(): Promise<void> {
    await Preferences.set({
      key: this.#storageKey,
      value: JSON.stringify(this.#photoURIs),
    })
  }

  #getPhotoDate(uri: string): string {
    const timestamp = parseInt(uri.split('.')[0], 10);
    return new Date(timestamp).toISOString();
  }

  async deleteImage(index: number): Promise<void> {
    const deletedFile = this.photos[index]
    this.photos.splice(index, 1)
    this.#photoURIs = this.#photoURIs.filter(u => u !== deletedFile?.path)
    await Promise.all([
      this.#persistPhotoURIs(),
      this.#deleteImageFromFilesystem(deletedFile),
    ])
  }
  async #deleteImageFromFilesystem(photo: Photo): Promise<void> {
    if (!photo.path) {
      throw new Error(`The photo can be deleted because the path attribute isn't set`)
    }

    await Filesystem.deleteFile({
      path: photo.path,
    })
  }
}
