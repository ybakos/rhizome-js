const ipfs = require('ipfs-http-client');
const chokidar = require('chokidar');
const NodeCache = require( "node-cache" );
const fs = require('fs');
const cwd = process.cwd();

const init = async (ipfs, cache)=> {
  const fileTable = new cache();
  const ipfsNode = await new ipfs();

  await ipfsNode.files.mkdir('/sharedPrivate', { create: true, parents: true } );

  return { ipfsNode, fileTable };
};

const cacheCheck = (path, hash, fileTable)=> {
  const matches = (hash === fileTable.get(path));
  return matches;
}

const fileUpdate = async(ipfsNode, rootDirHash, fileTable) =>{
  const files = await ipfsNode.ls(rootDirHash);
  const updatedFiles = files.map(async(file) => {

    if (file.type === 'dir') {
      //check fileTable first
      await fileUpdate(ipfsNode, file.path, fileTable);
    }
    if (file.type === 'file') {

      let fileHashPath = file.path.split('/');
      fileHashPath.shift();
      const filePath = '/' + fileHashPath.join('/');
      //check fileTable
      if (cacheCheck(filePath, file.hash, fileTable)) return;

      let data = await ipfsNode.get(file.path);
      data = data[0].content.toString();
      fs.writeFile(filePath, data ,(err) => {if (err) throw err;});
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
    await fileTable.set(path, hash);
  })
  .on('change', async(path) => {
    await ipfsNode.files.write(privatePath + path, path, { create: true, parents: true });
    const { hash } = await ipfsNode.files.stat(privatePath + path);
    //update cache
    await fileTable.set(path, hash);
  })
  .on('unlink', async(path) => {
    try {
      await ipfsNode.files.rm(privatePath + path, { recursive: true });
      //remove from cache
      await fileTable.del(path);
    } catch (error) {
        console.log(error, "oops")
    }
  })
  .on('error', path => {

  })

  return watcher;
}

const main = async (config = { directory: cwd}) => {
  const {
    ipfsNode,
    fileTable
  } = await init(ipfs, NodeCache, config.ipfsSettings);

  await fsHeartbeat(ipfsNode, fileTable);
  watch(directory + '/dev', ipfsNode, fileTable);

  //put into a worker
  await setInterval(async() => {
    await fsHeartbeat(ipfsNode, fileTable);
  }, config.interval|| 5000);
}

module.exports = main;
