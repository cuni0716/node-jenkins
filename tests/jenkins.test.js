const chai = require('chai');
const nock = require('nock');
const Jenkins = require('../lib');

const { expect } = chai;

const jenkinsId = 'jenkins-id';
const jenkinsToken = 'jenkins-token';
const jenkinsPath = 'jenkins.com';
const crumbIssuerResponseOk = { crumbRequestField: 'some-string', crumb: 's3cr3t' };
const crumbIssuerResponseKo = { response: { key1: 1, key2: 2 } };
const infoResponseOk = { key1: 1, key2: 2, key3: 3 };


describe('Jenkins', () => {
  describe('instance a Jenkins object', () => {
    it('we can instance a Jenkins object without custom headers', () => {
      const jenkins = new Jenkins(jenkinsId, jenkinsToken, jenkinsPath);
      expect(jenkins).to.be.an('object');
      expect(jenkins).to.have.all.keys('token', 'baseUrl', 'urlParams', 'headers', 'crumb');
      expect(jenkins.token).to.be.a('string');
      expect(jenkins.token).to.equal(jenkinsToken);
      expect(jenkins.baseUrl).to.be.a('string');
      expect(jenkins.baseUrl).to.equal(`http://${jenkinsId}:${jenkinsToken}@${jenkinsPath}`);
      expect(jenkins.urlParams).to.be.an('object');
      expect(jenkins.urlParams).to.have.all.keys('token');
      expect(jenkins.urlParams.token).to.equal(jenkinsToken);
      expect(jenkins.headers).to.be.an('object');
      expect(jenkins.headers).to.have.all.keys('Authorization');
      expect(jenkins.headers.Authorization).to.equal(jenkinsToken);
      expect(jenkins.crumb).to.be.null;
    });
    it('we can instance a Jenkins object with custom headers', () => {
      const jenkins = new Jenkins(jenkinsId, jenkinsToken, jenkinsPath, { header1: 'header1', header2: 'header2' });
      expect(jenkins).to.be.an('object');
      expect(jenkins).to.have.all.keys('token', 'baseUrl', 'urlParams', 'headers', 'crumb');
      expect(jenkins.token).to.be.a('string');
      expect(jenkins.token).to.equal(jenkinsToken);
      expect(jenkins.baseUrl).to.be.a('string');
      expect(jenkins.baseUrl).to.equal(`http://${jenkinsId}:${jenkinsToken}@${jenkinsPath}`);
      expect(jenkins.urlParams).to.be.an('object');
      expect(jenkins.urlParams).to.have.all.keys('token');
      expect(jenkins.urlParams.token).to.equal(jenkinsToken);
      expect(jenkins.headers).to.be.an('object');
      expect(jenkins.headers).to.have.all.keys('Authorization', 'header1', 'header2');
      expect(jenkins.headers.Authorization).to.equal(jenkinsToken);
      expect(jenkins.headers.header1).to.equal('header1');
      expect(jenkins.headers.header2).to.equal('header2');
      expect(jenkins.crumb).to.be.null;
    });
  });
  describe('private methods', () => {
    describe('_getCrumb method', () => {
      afterEach(() => nock.cleanAll());
      it('should work with correct data', (done) => {
        const jenkins = new Jenkins(jenkinsId, jenkinsToken, jenkinsPath);
        nock(jenkins.baseUrl).get('/crumbIssuer/api/json').reply(200, crumbIssuerResponseOk);
        jenkins._getCrumb().then((crumb) => {
          expect(crumb).to.be.an('object');
          expect(crumb).to.have.all.keys(Object.keys(crumbIssuerResponseOk));
          expect(jenkins.crumb).to.be.an('object');
          expect(jenkins.crumb).to.have.all.keys(Object.keys(crumbIssuerResponseOk));
          done();
        });
      });
      it('shouldn\'t throw if API response is not ok', (done) => {
        const jenkins = new Jenkins(jenkinsId, jenkinsToken, jenkinsPath);
        nock(jenkins.baseUrl).get('/crumbIssuer/api/json').replyWithError(crumbIssuerResponseKo);
        jenkins._getCrumb().then(() => done());
      });
    });
    describe('_getRequest method', () => {
      it('should works correctly', () => {
        const jenkins = new Jenkins(jenkinsId, jenkinsToken, jenkinsPath);
        jenkins.crumb = crumbIssuerResponseOk;

        const tests = [
          { raw: '/api/json', parsed: 'http://jenkins-id:jenkins-token@jenkins.com/api/json?token=jenkins-token' },
          { raw: '/some/job/api/json', parsed: 'http://jenkins-id:jenkins-token@jenkins.com/some/job/api/json?token=jenkins-token' },
          { raw: 'http://jenkins.pimpam.io:19080/job/Services/', parsed: 'http://jenkins-id:jenkins-token@jenkins.com/job/Services?token=jenkins-token' },
          { raw: '/some/job/', parsed: 'http://jenkins-id:jenkins-token@jenkins.com/some/job?token=jenkins-token' },
          { raw: 'some/job/', parsed: 'http://jenkins-id:jenkins-token@jenkins.com/some/job?token=jenkins-token' },
          { raw: 'some/job', parsed: 'http://jenkins-id:jenkins-token@jenkins.com/some/job?token=jenkins-token' },
          { raw: 'some/job/', parsed: 'http://jenkins-id:jenkins-token@jenkins.com/some/job?token=jenkins-token' },
        ];

        tests.forEach(async (test) => {
          const [url, headers] = await jenkins._getRequest(test.raw);
          expect(url).to.eql(test.parsed);
          expect(headers).to.deep.equal({ headers: { Authorization: 'jenkins-token', 'some-string': 's3cr3t' } });
        });
      });
    });
  });
  describe('public methods', () => {
    describe('info method', () => {
      afterEach(() => nock.cleanAll());
      it('should work correctly');
    });
    describe('getJobInfo method', () => {
      it('should work correctly');
    });
    describe('getBuildInfo method', () => {
      it('should work correctly');
    });
    describe('build method', () => {
      it('should work correctly');
    });
    describe('buildWithParams method', () => {
      it('should work correctly');
    });
    describe('toString method', () => {
      it('should return correct string', () => {
        const jenkins = new Jenkins(jenkinsId, jenkinsToken, jenkinsPath);
        const jenkinsStr = jenkins.toString();
        expect(jenkinsStr).to.be.a('string');
        expect(jenkinsStr).to.equal(`<Jenkins ${jenkinsToken}>`);
      });
    });
  });
});
