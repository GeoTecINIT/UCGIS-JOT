## UCGIS - Job Offer Tool (JOT)

#### Introduction

The [Job Offer Tool (JOT)](https://ucgis-tools-jot.web.app) allows users to create job and training offers in the field of Earth Observation and Geographic Information. These offers can be based on an occupational profile – a prototypical function description in the field – or created from scratch. Job offers use the UCGIS BoK to precisely describe EO/GI-specific concepts and skills, and the [European Skills/Competences and Occupation (ESCO)](https://ec.europa.eu/esco/portal/skill) classification for transversal skills. For a better dissemination JOT allows sharing and exporting a job offer in different formats.

#### Authors
The UCGIS BoK tools are developed by the [Geospatial Technologies Research Group](http://geotec.uji.es/) (GEOTEC) from the University Jaume I, Castellón (Spain) and are Licenced under GNU GPLv3.


## Installation

#### Prerequisites
Before you begin, make sure your development environment includes `Node.js®` and an `npm` package manager.

###### Node.js
Angular requires `Node.js` version 8.x or 10.x.

- To check your version, run `node -v` in a terminal/console window.
- To get `Node.js`, go to [nodejs.org](https://nodejs.org/).

###### Angular CLI
Install the Angular CLI globally using a terminal/console window.
```bash
npm install -g @angular/cli
```

### Clone repo

``` bash
# clone the repo
$ git clone https://github.com/GeoTecINIT/UCGIS-JOT.git my-project

# go into app's directory
$ cd my-project

# install app's dependencies
$ npm install
```

## Firebase
Set up a Firebase project, and copy keys to src/environments/environments.ts 

## Usage

``` bash
# serve with hot reload at localhost:4200.
$ ng serve

# build for production with minification
$ ng build
```
