import * as randomstring from 'randomstring';

export const Secret = {
  /**
   *
   * @param length
   */
  generateKey: (length = 8) => {
    return randomstring.generate({
      length: length,
      charset: 'alphanumeric',
    });
  },

  /**
   *
   * @param length
   */
  generateSecret: (length = 32) => {
    return randomstring.generate({
      length: length,
      charset: 'alphanumeric',
    });
  },
  randomFixedInteger: (length: number) => {
    return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
  }
};
