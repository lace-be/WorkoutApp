import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core'
import {PhotoService} from '../../services/photo.service'
import {ActivatedRoute} from '@angular/router'
import {ConfigService} from '../../services/config.service'
import {AlertController, Gesture, GestureController, ToastController} from '@ionic/angular'
import Swiper from 'swiper'

@Component({
  selector: 'app-swipe',
  templateUrl: './swipe.page.html',
  styleUrls: ['./swipe.page.scss'],
})
export class SwipePage implements OnInit {

  @ViewChild('swiperRef') swiperRef?: ElementRef
  swiper?: Swiper

  photoService = inject(PhotoService)
  activatedRoute = inject(ActivatedRoute)
  configService = inject(ConfigService)
  #toastController = inject(ToastController)
  #gestureController = inject(GestureController)
  #alertController = inject(AlertController)

  photos = this.photoService.photos
  deleteTimeoutId?: number
  initialSlide = 0
  fullScreen = false
  doubleClickGesture?: Gesture

  readonly #doubleClickThreshold = 250
  #lastOnDoubleClickStart = 0
  #isFirstRun = true
  #deletedSlide?: HTMLElement
  #deletedSlideIndex?: number

  constructor() {
    this.configService.hasVisitedPage('swipe').then(x => this.#isFirstRun = !x)
  }

  ngOnInit() {
    this.initialSlide = Number(this.activatedRoute.snapshot.paramMap.get('index'))
  }

  /**
   * This method is executed every time the user enters this view.
   * The view has been loaded here, and as such fields that are decorated with ViewChild are available.
   */
  ionViewDidEnter(): void {
    this.swiper = this.swiperRef?.nativeElement.swiper
    this.#addDoubleClickGesture().then()
  }

  /**
   * Delete an image in the gallery, the user is given 2 seconds to cancel te action.
   */
  async delete(): Promise<void> {
    const i = this.swiper?.activeIndex

    if (i !== undefined) {
      // @ts-ignore
      this.#deletedSlide = this.swiper?.slides?.at(i)
      this.#deletedSlideIndex = i
      await this.presentDeleteToast()
      this.deleteTimeoutId = window.setTimeout(
        () => {
          this.#toastController.dismiss()
          this.photoService.deleteImage(i)
        },
        2000,
      )
      this.swiper?.removeSlide(i)
    }
  }

  /**
   * Show a toast that informs the user that an image has been deleted.
   */
  async presentDeleteToast() {
    const toast = await this.#toastController.create({
      message: 'Photo deleted',
      position: 'bottom',
      buttons: [
        {
          side: 'end',
          text: 'UNDO',
          handler: () => {
            clearTimeout(this.deleteTimeoutId)
            if (this.#deletedSlide && this.#deletedSlideIndex !== undefined) {
              this.swiper?.addSlide(this.#deletedSlideIndex, this.#deletedSlide)
              this.swiper?.slideTo(this.#deletedSlideIndex)
              this.#deletedSlide = this.#deletedSlideIndex = undefined
            }
          },
        },
      ],
    })
    await toast.present()
  }

  /**
   * Switch fullscreen mode on or off.
   * An alert will be presented if this is the first time that fullscreen mode is toggled on.
   */
  async toggleFullScreen(): Promise<void> {
    this.fullScreen = !this.fullScreen

    if (this.#isFirstRun) {
      await this.#presentFirstRunAlert()
      this.#isFirstRun = false
      await this.configService.markPageAsVisited('swipe')
    }
  }

  async #presentFirstRunAlert() {
    const alert = await this.#alertController.create({
      header: 'Fullscreen',
      message: `You've entered fullscreen mode, tap twice on the image to exit.`,
      buttons: ['OK'],
    })

    await alert.present()
  }

  /**
   * Add a listener for double click gestures.
   * The event should be canceled when leaving the page, see lecture 7.
   *
   * @private
   */
  async #addDoubleClickGesture(): Promise<void> {
    const el = this.swiper?.wrapperEl

    if (!el) {
      return
    }

    this.doubleClickGesture = this.#gestureController.create(
      {
        el,
        threshold: 0,
        onStart: () => this.#onDoubleClickStart(),
        gestureName: 'DoubleClick',
      },
    )

    this.doubleClickGesture?.enable()
  }

  /**
   * Check if two taps were close enough together to count as a double tap.
   * If so, activate fullscreen mode.
   *
   * @private
   */
  #onDoubleClickStart(): void {
    const now = Date.now()

    if (Math.abs(now - this.#lastOnDoubleClickStart) <= this.#doubleClickThreshold) {
      this.toggleFullScreen().then()
      this.#lastOnDoubleClickStart = 0
    } else {
      this.#lastOnDoubleClickStart = now
    }
  }

}
