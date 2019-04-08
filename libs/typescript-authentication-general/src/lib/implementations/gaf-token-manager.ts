import { CacheInstance, CacheItem } from '@gaf/typescript-simple-cache';
import { GafJwtHelper } from '@gaf/typescript-jwt';

export class GafTokenManager {
  private _tokenCache: CacheInstance<string> = new CacheInstance<string>();
  private _jwtHelper: GafJwtHelper = new GafJwtHelper();

  /**
   * Get a token, and possibly check for expiration
   * @param key Key to look for
   * @param threshold time (in ms) buffer to consider a token as not alive anymore
   * @param checkExpired check to see if it is expired
   */
  public get(key: string, threshold: number = 0, checkExpired: boolean = true): CacheItem<string> | undefined {
    let item = this._tokenCache.get(key);
    if (checkExpired && item !== undefined) {
      if (this._jwtHelper.isTokenExpired(item.value, threshold / 1000)) {
        item = undefined;
      }
    }

    return item;
  }

  /**
   * set a token into the cache
   * @param key Key to add
   * @param token Token to add
   */
  public set(key: string, token: string): CacheItem<string> {
    return this._tokenCache.add(key, token);
  }

  /**
   * List of tokens that are cached
   */
  public get list(): CacheItem<string>[] {
    return this._tokenCache.list;
  }

  /**
   * Remove all tokens from the cache
   */
  public removeAll(): void {
    this._tokenCache.removeAll();
  }

  /**
   * Remove items from cache
   * @param key token key to remove
   */
  public remove(key: string): void {
    this._tokenCache.remove(key);
  }
}
