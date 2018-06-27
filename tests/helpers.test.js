const chai = require('chai');
const Helpers = require('../lib/helpers');

const { expect } = chai;


describe('Helpers', () => {
  describe('getBaseUrl', () => {
    it('should works correctly', () => {
      const id = 'id';
      const token = 'token';
      const tests = [
        { raw: 'http://jenkins1.com', parsed: 'http://id:token@jenkins1.com' },
        { raw: 'https://jenkins2.com', parsed: 'https://id:token@jenkins2.com' },
        { raw: 'http://jenkins3.com:10080', parsed: 'http://id:token@jenkins3.com:10080' },
        { raw: 'jenkins4.com', parsed: 'http://id:token@jenkins4.com' },
        { raw: 'jenkins.pimpam.io:19080', parsed: 'http://id:token@jenkins.pimpam.io:19080' },
      ];
      tests.forEach((test) => {
        expect(Helpers.getBaseUrl(id, token, test.raw)).to.eql(test.parsed);
      });
    });
  });
  describe('sleep', () => {
    it('should works correctly');
  });
});
