let categories = [
  require('./lib/compatibility'),
  require('./lib/database'),
  require('./lib/engineering'),
  require('./lib/logical'),
  require('./lib/math-trig'),
  require('./lib/text'),
  require('./lib/date-time'),
  require('./lib/financial'),
  require('./lib/information'),
  require('./lib/lookup-reference'),
  require('./lib/statistical'),
  require('./lib/miscellaneous'),
  require('./lib/custom')
];

for (let c in categories) {
  let category = categories[c];
  for (let f in category) {
    exports[f] = exports[f] || category[f];
  }
}
