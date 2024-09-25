import {inject, Injectable} from '@angular/core'
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject'
import {
  Auth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  PhoneAuthProvider,
  signInWithCredential,
  signOut,
  updateProfile,
  User,
} from '@angular/fire/auth'
import {Router} from '@angular/router'
import {FirebaseAuthentication} from '@capacitor-firebase/authentication'
import {Capacitor} from '@capacitor/core'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #currentUser: BehaviorSubject<null | User> = new BehaviorSubject<null | User>(null)
  currentUser = this.#currentUser.asObservable()

  #verificationId?: string

  #auth = inject(Auth)
  #router = inject(Router)

  constructor() {
    this.#auth.onAuthStateChanged(user => this.#setCurrentUser(user))
  }

  isLoggedIn(): boolean {
    return !!this.#currentUser.value
  }

  getProfilePic(): string {
    const placeholder = '/assets/Portrait_Placeholder.png'
    if (!this.isLoggedIn()) {
      return placeholder
    }
    return this.#currentUser.value?.photoURL ?? placeholder
  }

  getDisplayName(): string | undefined {
    return this.#currentUser.value?.displayName ?? undefined
  }

  getEmail(): string | undefined {
    return this.#currentUser.value?.email ?? undefined
  }

  getUserUID(): string | undefined {
    return this.#currentUser.value?.uid
  }

  async signOut(): Promise<void> {
    await FirebaseAuthentication.signOut()

    if (Capacitor.isNativePlatform()) {
      await signOut(this.#auth)
    }
  }

  async signInWithGoogle(): Promise<void> {
    // Sign in on the native layer.
    const authResult = await FirebaseAuthentication.signInWithGoogle()
    const idToken = authResult?.credential?.idToken

    if (!idToken) {
      throw new Error('Google login failed. Please try again.')
    }

    // Sign in on the web layer.
    if (Capacitor.isNativePlatform()) {
      const credential = GoogleAuthProvider.credential(idToken)
      await signInWithCredential(this.#auth, credential)
    }

  }

  async signInWithFacebook(): Promise<void> {
    const result = await FirebaseAuthentication.signInWithFacebook();
    const idToken = result.credential?.accessToken;

    if (idToken) {
      const credential = FacebookAuthProvider.credential(idToken);
      await signInWithCredential(this.#auth, credential);
    } else {
      throw new Error('Facebook login failed. Please try again.');
    }

    // Sign in on the web layer.
    if (Capacitor.isNativePlatform()) {
      const credential = FacebookAuthProvider.credential(idToken)
      await signInWithCredential(this.#auth, credential)
    }
  }

  /**
   * The login process for a phone is seperated in two parts.
   *  1. A Verification code is sent to the user (this method).
   *  2. The verification code is entered on the website and used to log in.
   *
   * @param phoneNumber The phone number to which the verification code must be sent.
   */
  async sendPhoneVerificationCode(phoneNumber: string): Promise<void> {
    const listener = await FirebaseAuthentication.addListener('phoneCodeSent', ({verificationId}) => {
      this.#verificationId = verificationId
      listener.remove()
    })
    await FirebaseAuthentication.signInWithPhoneNumber({phoneNumber})
  }

  /**
   * Authenticate the user through the verification send to his phone number.
   *
   * @param verificationCode
   */
  async signInWithPhoneNumber(verificationCode: string): Promise<void> {
    if (!this.#verificationId) {
      throw new Error(`No valid verificationId found, ensure the sendPhoneVerificationCode method was called first.`)
    }

    const credential = PhoneAuthProvider.credential(this.#verificationId, verificationCode)
    await signInWithCredential(this.#auth, credential)
  }

  async updateDisplayName(displayName: string): Promise<void> {
    if (!this.#currentUser.value) {
      throw new Error('Not authenticated')
    }

    await updateProfile(this.#currentUser.value, {
      displayName,
    })
  }

  /**
   * Save the new user as an instance variable, and perform any necessary rerouting.
   *
   * @param user The new user.
   * @private
   */
  async #setCurrentUser(user: User | null): Promise<void> {
    this.#currentUser.next(user)
    if (this.#currentUser.value) {
      await this.#router.navigate(['/'])
    } else {
      await this.#router.navigate(['/login'])
    }
  }
}


