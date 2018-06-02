# node-jenkins

### Usage


#### Create an instance

Options

* jenkinsId: `String` usually the email you use to log into your jenkins.
* jenkinsToken: `String` you can find it in your jenkins personal area.
* jobUrl: `String` url for the job you want to trigger.
* customHeaders: `Object` with custom headers to be sended in every request (don't worry about the 'Authorization' or crumb headers, node-jenkins do it for you ).

```js
import Jenkins from 'node-jenkins';

const jenkins = new Jenkins(jenkinsId, jenkinsToken, jobUrl, [customHeaders]);
```


#### Info

Retrieve server information.

```js
const info = await jenkins.info();
```
