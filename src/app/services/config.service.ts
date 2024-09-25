import { Injectable } from '@angular/core'
import {Preferences} from '@capacitor/preferences'

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  readonly #firstRunKey = 'firstRun';

  constructor() { }

  /**
   * Check if a page has previously been visited.
   *
   * @param page The page for which to check.
   * @return True if the page has been visited, false otherwise.
   */
  async hasVisitedPage(page: string): Promise<boolean> {
    const {value} = await Preferences.get({key: this.#firstRunKey})
    const visitedPages: string[] = (value && JSON.parse(value)) ?? []
    return visitedPages.includes(page)
  }

  /**
   * Mark a page as visited.
   *
   * @param page
   */
  async markPageAsVisited(page: string): Promise<void> {
    const {value} = await Preferences.get({key: this.#firstRunKey})
    const visitedPages = (value && JSON.parse(value)) ?? []
    visitedPages.push(page)
    await Preferences.set({key: this.#firstRunKey, value: JSON.stringify(visitedPages)})
  }
}
