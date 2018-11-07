[![Mail](https://badges.weareopensource.me/badge/Contact-By%20Mail-3498db.svg?style=flat-square)](mailto:pierrebrisorgueil@me.com?subject=Contact%20node%20osmosis%20wrapper) [![Packagist](https://badges.weareopensource.me/packagist/l/doctrine/orm.svg?style=flat-square)](/LICENSE.md)

# Presentation

The purpose was to to generate bash command from web scrapping.

For this, i made a simple conf wrapper of Osmosis in order to realize Web scrapping of a page only with a json conf file. 
In another step it can execute shell request, based on the Array of the JSON result.

# Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

- Node.js (8.x) - [Download & Install Node.js](https://nodejs.org/en/download/)

# Installation

It's straight forward

```bash
npm i
```

# Run Examples

```bash
cp sample.tasks.json tasks.json
npm test
```

you will see the result of example in console, and the result of bash command in out.log

* step 1 -> json result of web scrapping
* step 2 -> shell result of bash command in out.log

this launched "TASK='BITS' node index.js"
you can try this also : "TASK='FRANCETV' node index.js" 

# Prod Example with crontab

All monday @ 8H 00
```
00 08 * * 1 cd /home/USER/osmosisWrapperToSchell && TASK=BITS /home/USER/.nvm/versions/node/v10.9.0/bin/node index.js &
```

# Run your own config

you can add and edit your configs in the file task.json, by adding new objects and new wrapper in ./wrapper

```
"nameOfTheConfig": {
  "wrapper": "./wrappers/youtube.json", /* wrapper configuration for auto web scrapping (actually francetv & youtube) */
  "url": "https://www.youtube.com/user/USERNAME", /* page url */
}
```

try your conf  :

```
TASK=nameOfTheConfig node index.js
```

Console will show the result after web scrapping :)

All configuration detail : 

```
"nameOfTheConfig": {
  /****** SCRAPPER ******/
  // wrapper configuration for auto web scrapping (actually francetv & youtube)
  "wrapper": "./wrappers/youtube.json", 
  // page url
  "url": "https://www.youtube.com/channel/UCrmhXLlm2wnWKzrtlP8KJ2w/videos",

  /****** ARRAY ******/
  // Web scrapping create a json (step 1)
  // If this json contain an array
  //     - for broswe it and execute sheel command, use array option
  //     - else set it to null
  // (it result an array for youtube and france tv example, see ./wrappe/... for more information)
  "array": { 
      // array name in json
      "name": "items",
      // if you want to purge array based on a key */
      "filter": { 
          "_key_": "title", /* key name */
          "_value": "Bits" /* string to contain to keep the item in array */
      }
  },

  /****** COMMAND ******/
  // Bash to execute with your json object generated from web scrapping
  "command": {
    // command to execute, #link => link is a key of, your json object, or an item of your array (no space in names)
    "shell": "echo #link", 
    // true if you use array option and want to execute the command only on the last item (most recent)
    "last": true,
    // true if you want to be sure that the command is only executed once, based on an history in command.log
    "history": true 
  }
}
```

and try again :) 

```
TASK=nameOfTheConfig node index.js
```

- Or you can import libs in your projects

```
const path = require('path');
const Parser = require(path.resolve('./lib/parser.js'));

let p = new Parser('mytask');  
p.go();
```

# Explication

### Osmosis

The json conf file (wrapper/*) contain :

- the structure (destination vs source in html)
- the types (in order to convert data format, today options (available in lib/utils) : money, timestamp, int, float, schemeRelative)

something like this :

```
{
  "model": {
    "_structure": {
      "title": "h1",
      "items": [{
        "_find": ".card",
        "_set": {
          "link": ".link@href"
        }
      }]
    },
    "_types": [{
      "_data": "array",
      "_type": "schemeRelative",
      "_path": "items",
      "_key": "link"
    }]
  }
}

```

Based on `config.model._structure` we generate Osmosis configuration :

```
{
  "title": "h1",
  "items": [
    osmosis
    .find('.card')
    .set({
      "link": ".link@href"
    })
  ]
}
```

After this we convert type of data based on `config.model._types`

for :

```
<html>

<body>
  <h1>Your subject</h1>
  <div id="cards">
    <div class="card">
      <a href="//www.toto1.com">toto</a>
    </div>
    <div class="card">
      <a href="//www.toto2.com">toto</a>
    </div>
    <div class="card">
      <a href="//www.toto3.com">toto</a>
    </div>
  </div>
</body>

</html>
```

the result will be :
```
{
  "status": "ok",
  "result": {
    "article": "Your subject",
    "items": [
      {
        "link": "www.toto1.com"
      },
      {
        "link": "www.toto2.com"
      },
      {
        "link": "www.toto3.com"
      }
    ]
  }
}
```


### bash command 

with this options
```
"array": {
    "name": "items",
     "filter": {
        "key": "link",
        "string": "toto2"
     }
},
"command": {
   "shell": "echo #link",
   "last": true
}"
```

with will generate this : 

```
echo www.toto2.com
```

# License

[![Packagist](https://badges.weareopensource.me/packagist/l/doctrine/orm.svg?style=flat-square)](/LICENSE.md)
