const path = require('path');
const Parser = require(path.resolve('./lib/parser.js'));

let p = new Parser(process.env.TASK || 'FranceTvOnNestPasCouche');  

p.go();

