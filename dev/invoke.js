const { privateDirectory, publicDirectory } = require('../index');

publicDirectory().then((res)=>{
  console.log(res);

}).catch((err) => {
  console.log(err);
  process.exit(1);

});
