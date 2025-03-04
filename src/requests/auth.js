const TOKEN_KEY = "TOKEY";

export class Auth {
  static set token(value) {
    localStorage[TOKEN_KEY] = value;
  }

  static get token() {
    return localStorage[TOKEN_KEY];
  }

  static get isLogin() {
    return !!this.token;
  }

  static clear() {
    localStorage.removeItem(TOKEN_KEY);
  }
}
