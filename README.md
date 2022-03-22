# pdiff
diff tool for Akamai property rule tree

## How to Setup
Download and the docker image
```
docker pull iwanaga/atc-ninja:latest
docker run -p 9000:9000 -v /Users/`whoami`/.edgerc:/root/.edgerc -it --rm --name atc-ninja -d atc-ninja
docker logs -f iwanaga/atc-ninja
```

Open your browser and access to localhost:9000
```
open http://localhost:9000/
```

## Scripts for development
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Run server
```
cd server
node app.mjs
```

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Scripts for release
### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Docker
```
docker build -t pdiff .

docker run -p 9000:9000 -v ~/.edgerc:/root/.edgerc -it --rm --name pdiff -d pdiff
docker logs -f pdiff

docker stop pdiff

docker tag pdiff iwanaga/pdiff

docker login
docker push iwanaga/pdiff:latest
```
