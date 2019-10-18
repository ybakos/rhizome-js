
const ipfs = require('ipfs-http-client');
const chokidar = require('chokidar');
const NodeCache = require( "node-cache" );
const fs = require('fs');
const cwd = process.cwd();

const init = async (ipfs, cache)=> {
  const fileTable = new cache();
  const ipfsNode = await new ipfs();

  await ipfsNode.files.mkdir('/sharedPrivate', { create: true, parents: true } );

  return {ipfsNode, fileTable};
};

const fileUpdate = async(ipfsNode, rootDirHash, fileTable) =>{
  // if (ipnsHashLock === true) return;
  const files = await ipfsNode.ls(rootDirHash);
  
  // fileTable check to prevent rewriting unchanged files.

  const updatedFiles = files.map(async(file) => {

    if (file.type === 'dir') {
      //check fileTable first
      await fileUpdate(ipfsNode, file.path);
    }
    if (file.type === 'file' && file.name !== 'index.js') {
      //check fileTable
      let fileHashPath = file.path.split('/');
      let data = await ipfsNode.get(file.path);

      fileHashPath.shift();
      const filePath = fileHashPath.join('/');


      data = data[0].content.toString();
      fs.writeFile(`/${filePath}`, data ,(err) => {if (err) throw err;});
    }
  });

  return updatedFiles;
}

const fsHeartbeat = async(node, fileTable) => {
  const { hash: rootDirHash } = await node.files.stat('/sharedPrivate');
  await fileUpdate(node, rootDirHash, fileTable);

  return;
};

const watch = (directory, ipfsNode, fileTable) => {
  const privatePath = '/sharedPrivate';
  const watcher = chokidar.watch(directory, {
    ignored: [/(^|[\/\\])\../, string => string.includes('node_modules')]
  });

  watcher
  .on('add', async(path) => {
    await ipfsNode.files.write(privatePath + path, path, { create: true, parents: true });
    const { hash } = await ipfsNode.files.stat(privatePath + path); 
    //add to cache
    await fileTable.set(path, hash)
  })
  .on('change', async(path) => {
    await ipfsNode.files.write(privatePath + path, path, { create: true, parents: true });
    const { hash } = await ipfsNode.files.stat(privatePath + path);
    //update cache
    await fileTable.set(path, hash)
  })
  .on('unlink', async(path) => {
    try {
      await ipfsNode.files.rm(privatePath + path, { recursive: true });
      const { hash } = await ipfsNode.files.stat(privatePath + path);
      //remove from cache
      await fileTable.del(hash); 
    } catch (error) {
        console.log(error, "oops")
    }
  })
  .on('error', path => {

  })

  return watcher;
}

const main = async (config = {}) => {
  const { 
    ipfsNode,
    fileTable
  } = await init(ipfs, NodeCache, config.ipfsSettings);

  await fsHeartbeat(ipfsNode, fileTable);
  watch(cwd, ipfsNode, fileTable);

  //put into a worker
  await setInterval(async() => {
    console.log(fileTable)
    await fsHeartbeat(ipfsNode);
  }, config.interval|| 5000);
}

module.exports = main;