import { Injectable } from '@angular/core';

// app specific
import { GafStorageManagerMemory } from '@gaf/typescript-authentication-general';

/**
 * Basic memory only representation of our session.
 * This will work well in mobile since memory/storage is sandboxed anyway
 */
@Injectable({
  providedIn: 'root'
})
export class GafAuth0MemoryStorageService extends GafStorageManagerMemory {
  constructor() {
    super();
  }
}
