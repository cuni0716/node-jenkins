# node-jenkins

![License][license-image] ![Issues][issues-image] ![Vulnerabilities][vul-image] ![Dependencies][deps-image]

### Usage

#### Create an instance

**Options**

* **jenkinsId**: *`String`* usually the email you use to log into your jenkins.
* **jenkinsToken:** *`String`* you can find it in your jenkins personal area.
* **customHeaders:** *`Object`* with custom headers to be sended in every request (don't worry about the 'Authorization' or crumb headers, node-jenkins do it for you ).

```js
import Jenkins from 'node-jenkins';

const jenkins = new Jenkins(jenkinsId, jenkinsToken, [customHeaders]);
```


#### Info

**Retrieve server information.**

```js
const info = await jenkins.info();
```


## So much more comming soon...

[license-image]: https://img.shields.io/npm/l/node-jenkins.svg
[issues-image]: https://img.shields.io/github/issues/cuni0716/node-jenkins.svg
[deps-image]: https://david-dm.org/cuni0716/node-jenkins.svg
[vul-image]: https://snyk.io/test/github/cuni0716/node-jenkins.git/badge.svg
