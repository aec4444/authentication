import { WindowLocation } from '../helpers/window-location';

export class WindowLocationMock extends WindowLocation {
  private _url: string;

  assign(url: string): void {
    this._url = url;
  }

  get href(): string {
    return this._url;
  }

  set href(value: string) {
    this._url = value;
  }

  get pathname(): string {
    const l = document.createElement('a');
    l.href = this._url;
    return l.pathname;
  }

  set pathname(value: string) {
    const pathName = this.pathname;
    this._url = this._url.replace(pathName, value);
  }

  get hash(): string {
    if (this._url === undefined || this._url === null || this._url === '') {
      return '';
    }

    const hashLocation = this._url.indexOf('#');
    if (hashLocation >= 0) {
      return this._url.substring(hashLocation + 1);
    }

    return '';
  }

  set hash(value: string) {
    if (value === undefined || value === null) {
      value = '';
    }

    if (this._url !== undefined && this._url !== null && this._url !== '') {
      const hashLocation = this._url.indexOf('#');
      if (hashLocation >= 0) {
        this._url = this._url.substr(0, hashLocation + 1);
        this._url += value;
      } else {
        this._url = `${this._url}#${value}`;
      }
    } else {
      this._url = `#${value}`;
    }
  }

  get origin(): string {
    return window.location.origin;
  }

  get hostname(): string {
    return window.location.hostname;
  }

  set hostname(value: string) {
    // do nothing
  }

  get port(): string {
    return window.location.port;
  }

  set port(value: string) {
    // do nothing
  }

  get protocol(): string {
    return window.location.protocol;
  }

  set protocol(value: string) {
    // do nothing
  }

}
