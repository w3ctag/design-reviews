/***********************************
 * 19.1. Generate a signing key pair, sign some data
 **/
// Algorithm Object
var algorithmKeyGen = {
  name: "RSASSA-PKCS1-v1_5",
  // RsaKeyGenParams
  modulusLength: 2048,
  publicExponent: new Uint8Array([0x01, 0x00, 0x01]),  // Equivalent to 65537
};

var algorithmSign = {
  name: "RSASSA-PKCS1-v1_5",
  // RsaSsaParams
  hash: {
    name: "SHA-256",
  }
};

window.crypto.subtle.generateKey(algorithmKeyGen, false, ["sign"]).then(
  function(key) {
    var dataPart1 = convertPlainTextToArrayBufferView("hello,");
    var dataPart2 = convertPlainTextToArrayBufferView(" world!");
    // TODO: create example utility function that converts text -> ArrayBufferView

    return window.crypto.subtle.sign(algorithmSign, key.privateKey, [dataPart1, dataPar2]);
  },
  console.error.bind(console, "Unable to generate a key")
).then(
  console.log.bind(console, "The signature is: "),
  console.error.bind(console, "Unable to sign")
);


/***********************************
 * 19.2. Symmetric Encryption
 **/
var clearDataArrayBufferView = convertPlainTextToArrayBufferView("Plain Text Data");
// TODO: create example utility function that converts text -> ArrayBufferView

var aesAlgorithmKeyGen = {
  name: "AES-CBC",
  // AesKeyGenParams
  length: 128
};

var aesAlgorithmEncrypt = {
  name: "AES-CBC",
  // AesCbcParams
  iv: window.crypto.getRandomValues(new Uint8Array(16))
};

// Create a keygenerator to produce a one-time-use AES key to encrypt some data
window.crypto.subtle.generateKey(aesAlgorithmKeyGen, false, ["encrypt"]).then(
  function(aesKey) {
    return window.crypto.subtle.encrypt(aesAlgorithmEncrypt, aesKey, [ clearDataArrayBufferView ]);
  }
).then(console.log.bind(console, "The ciphertext is: "),
       console.error.bind(console, "Unable to encrypt"));
