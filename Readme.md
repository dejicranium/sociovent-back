# API SCAFFOLD FOR NODE API-RELEATED PROJECTS
====================
# FOLDERS

## `boot`
Contains utility for auto-loading contents of a directory. If you have a service folder called merchantmanagement that contains files such as: createmerchant.js, blockmerchant.js e.t.c. With the bootloader you could add a file index.js like so:
```
const loader = require('mlar')('boot');
module.exports = loader(__dirname, module.filename);
```

Doing the above makes it possible to load all the merchant services like so:
```
const merchantServices = require('./merchants');
// Boot loader makes it possible to do this:
merchantServices.createmerchant({... SomeData });
```

## `config`
Contains app configuration

## `logs`
Contains static, local (for dev only) log files

## `migrations`
Sequelize migration files

## `models`
Contains model definitions for any ORM[s] used in the project

## `routes`
Contains route handler definitions. It contains the following sub-folders
`middlewares` : Contains middleware definitions exposed using the service bootloader
Every other directory in the routes folder is created according to the context supported by the API and or web app. For example, creating a folder `api` implies there's a context called API supported by the API. This means, relative to the base URL, all access to the route `/api/*` should be handled by handlers defined in the `api` folder. Handlers are grouped, together in a folder, according to the function they perfom within a given context. For example, all merchant related handlers would be defined in this folder `/api/merchants` (E.G. to create a merchant, the route `POST` `/api/merchants` could be handled by the handler `/api/merchants/create.js`, to get a merchant's information, the handler could be defined in the folder as `/api/merchants/get.js` and served by the route `GET` `/api/merchants/{merchantId}`
Similarly, if you create a folder called `dashboard`, it means, all access to the route `/dashboard/*` should be handled by handlers defined in the `dashboard` folder.

## `services`
Contains service files that either, directly, are called by route handlers or are independently called to handle some other specific task in the system. Services are also grouped, in folders, according to the functions they perform. All functions related to merchant management could, for example, be placed in files created in the `services/merchants` folder.

## `test`
Contains test files

## `utils`
Contains util functions that enhance functionality.

# FILES

## `r.json`
This file contains the resolution paths for modules / services used by the app. All node apps will use the package, `mlar` to manage module / service resolution and the file is a requirment for it to work. Once a mapping is done in `r.json`, module resolution is done relative to these mappings. Consider an `r.json` file with the following mapping:
```
"utils": "/utils", //A directory
"util": "/utils/index", // A file
```
If you were in the directory `/routes/api/merchant` and you needed a function exposed in the `/utils/index` file, you would do something like:
```
const util = require('../../../utils/index');
```
With mlar however, you only need to do: `const util = require('mlar')('util');`
Same applies to directories, still using `/routes/api/merchant` as an example, if you need a util in the utils directory you'd do something like:
```
const util = require('../../../utils/requestformatter');
```
With `mlar`, you only need to do: `const requestformatter = require('mlar').mreq('utils', 'requestformatter');`

# ENV VARIABLES

## `USETHRONG` 
Set this environment variable if you wish to use the multiple cpu cores available on a server.

## `THRONGWORKERS`
Set this environment variable if you wish to control how many of the multiple cpu cores available on a server you wish to use. If it's not set, the maximum amount of cpu cores available on the server is used. The variable depends on `USETHRONG` being set.