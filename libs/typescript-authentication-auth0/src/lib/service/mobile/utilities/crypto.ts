import * as crypto from 'crypto-js';

function base64UrlSafeEncode(string) {
  return string.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest();
}

export function generateProofKey() {
  const codeVerifier = base64UrlSafeEncode(crypto.randomBytes(32));
  const codeChallenge = base64UrlSafeEncode(sha256(codeVerifier));
  return {
    codeVerifier: codeVerifier,
    codeChallenge: codeChallenge
  };
};

export function generateState() {
  return base64UrlSafeEncode(crypto.randomBytes(32));
};
