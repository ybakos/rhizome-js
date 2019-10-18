const index = require('../index');

index().then((res)=>{
  console.log(res);

}).catch((err) => {
  console.log(err);
  process.exit(1);
});