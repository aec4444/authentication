/**
 * Object used for windows calls to make window object testable
 */
export class WindowLocation {
  assign(url: string): void {
    window.location.assign(url);
  }

  get pathname(): string {
    return window.location.pathname;
  }

  set pathname(value: string) {
    window.location.pathname = value;
  }

  get origin(): string {
    return window.location.origin;
  }

  get hostname(): string {
    return window.location.hostname;
  }

  set hostname(value: string) {
    window.location.hostname = value;
  }

  get port(): string {
    return window.location.port;
  }

  set port(value: string) {
    window.location.port = value;
  }

  get protocol(): string {
    return window.location.protocol;
  }

  set protocol(value: string) {
    window.location.protocol = value;
  }

  get hash(): string {
    return window.location.hash;
  }

  set hash(value: string) {
    window.location.hash = value;
  }

  get href(): string {
    return window.location.href;
  }

  set href(value: string) {
    window.location.href = value;
  }
}
