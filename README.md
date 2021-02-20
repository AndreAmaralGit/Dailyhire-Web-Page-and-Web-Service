# Dailyhire Web Page and Web Service

In this repository, you can find the Dailyhire Web Page and Web Service. Dailyhire also has a mobilwe application allocated in the following repository: "https://github.com/AndreAmaralGit/Dailyhire-app".

This project aims to bring unskilled workers closer to their potential customers. An application profile was developed, which makes it possible to export Linked Data on the home page. Only data defined as public is exported, via an RDF_XML file. The development of this project was based on the ideologies of the Social and Solidarity Economy.

## Installation

Some functions, use the Google Maps API or Algolia Places API, so if you want them to work you need to provide your own API key. The files in need of the API are:

- Algolia Places: "frontPage.ejs", "createService.js", "profileWorker.js" and "profile.js".
- Google Maps: "map.ejs" and "workers.js".

After that, you will need to provide a MongoDB URL for your database, located in the files "app.js" and "socketApi.js".

## Usage

```console
npm install 
npm start 
```
Now you can use both the App and the Web Page, which can be found at the following address "http://localhost:8080".

## License
[MIT](https://choosealicense.com/licenses/mit/)
