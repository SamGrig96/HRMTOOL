### To run the project in dev mode you need to have installed

[Node.js](https://nodejs.org/) (>= v12.18.3) \
[Yarn](https://yarnpkg.com/) (>= v1.22.3) \
[Git](https://git-scm.com/) (>= v2.25.1) \
[IDE](https://medium.com/@rifdhan/choosing-a-javascript-editor-b7d8035329db) \
[Browser](https://www.google.com/chrome/)

### To run the project in prod mode you need to have installed

[Docker](https://www.docker.com/) (>= v20.10.2) \
[Docker-compose](https://docs.docker.com/compose/) (>= v1.25.0)`

## Run the project

### To run the project in dev mode please run:

`yarn` or `yarn install` Installs all required dependencies/packages in `node_modules` folder

`yarn start` Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the
browser.

### To run the project in prod mode please run:

`docker-compose build --no-cache` Builds the project image inside the Docker container

`docker-compose up -d` Runs the prepared project image. Open [http://localhost](http://localhost) to view it in the
browser.

## Development flow
- take a ticket from [Jira Board](https://groupolm.atlassian.net/browse/HR) (e.g. `XX-000`)
- [create a fork](https://support.atlassian.com/bitbucket-cloud/docs/fork-a-repository/) from the main repo (master branch)
- do some magic
- commit / push your changes, \
  IMPORTANT: enter your ticket id first in commit message \
  (e.g. `XX-000 did some magic here`)
- [create a PR](https://support.atlassian.com/bitbucket-cloud/docs/create-a-pull-request-to-merge-your-change/) to main repo \
  - staging branch, if you / QA specialist need(s) / want(s) to test your changes on staging \
  - develop branch, if it's ready to go live
- tell your team-lead to review / merge your changes 


## Learn More

You can learn more in
the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started). \
To learn React, check out the [React documentation](https://reactjs.org/).
