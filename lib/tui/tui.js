const blessed = require('blessed');
const contrib = require('blessed-contrib');
const _ = require('lodash');

const tui = (PFM) => {

  const screen = blessed.screen({
    autoPadding: true,
    smartCSR: true
  });
  //create layout and widgets
  const grid = new contrib.grid({rows: 1, cols: 2, screen: screen})

  createEntryTree(grid, screen, PFM);
  screen.render()

}

const taggedTable = (grid,screen,data,pfm, tag) => {
  const list = grid.set(0, 1, 1, 1, blessed.list, 
    { keys: true
    , fg: 'green'
    , label: `Hashes tagged: ${tag}`
    , columnWidth: [24, 10, 10]})

  const textbox = blessed.textarea({
    parent: list,
    name: 'Details',
    keys: true,
    bottom: 0,
    left: 10,
    height: 1,
    width: '50%',
    style: {
      fg: 'white',
      bg: 'black'
    }
  });
  
  const tagInputLabel = blessed.text({
    parent: list,
    bottom: 0,
    left: 0,
    content: 'Message:'
  });

  list.focus();
  list.setItems(data);

  list.on('select',async(data)=> {
    const message = await pfm.read(data.content);
    textbox.setText(message);
    list.focus();
    screen.render();
  });

}

const createEntryTree = (grid, screen, PFM) => {
  const tree =  grid.set(0, 0, 1, 1, contrib.tree, 
    { style: { text: "red" }
    , template: { lines: true }
    , label: 'Filesystem Tree'})

  // const form = createForm(screen, grid);
    
  //file explorer
  const explorer = { name: 'Looker'
    , extended: true
    // Child generation function
    , children: {
        "Create": {
          function: async()=> {return createShareForm(screen, grid, PFM) }
        },
        "Explore": {
          function: async()=> {return createExploreForm(screen, grid, PFM)}
        }
      }
  }
  //set tree
  tree.setData(explorer);

  // Handling select event. Every custom property that was added to node is 
  // available like the "node.getPath" defined above
  tree.on('select', async(node)=>{
    await node.function();
  });

  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  tree.focus()
}

const createShareForm = (screen,grid,pfm) => {
  const form = grid.set(0, 0, 1, 1, blessed.form, 
  { keys: true
  , fg: 'green'
  , label: 'Share'
  , columnWidth: [24, 10, 10]})

  const textInput = blessed.textbox({
    parent: form,
    name: 'Text',
    input: true,
    mouse: true,
    keys: true,
    top: 3,
    left: 5,
    height: 1,
    width: '70%',
    style: {
      fg: 'white',
      bg: 'black',
      focus: {
        bg: 'red',
        fg: 'white'
      }
    }
  });
  const textInputLabel = blessed.text({
    parent: form,
    top: 3,
    left: 0,
    content: 'Text:'
  });
  
  const tagInput = blessed.textbox({
    parent: form,
    name: 'Tags',
    input: true,
    mouse: true,
    keys: true,
    top: 5,
    left: 5,
    height: 1,
    width: '70%',
    style: {
      fg: 'white',
      bg: 'black',
      focus: {
          bg: 'red',
          fg: 'white'
      }
    }
  });

  const tagInputLabel = blessed.text({
    parent: form,
    top: 5,
    left: 0,
    content: 'Tags:'
  });
  
  const submit = blessed.button({
    parent: form,
    mouse: true,
    keys: true,
    shrink: true,
    padding: {
      left: 1,
      right: 1
    },
    left: 10,
    top: 10,
    shrink: true,
    name: 'submit',
    content: 'submit',
    style: {
      bg: 'blue',
      focus: {
        bg: 'red'
      },
      hover: {
        bg: 'red'
      }
    }
  });
  
  const cancel = blessed.button({
    parent: form,
    mouse: true,
    keys: true,
    shrink: true,
    padding: {
      left: 1,
      right: 1
    },
    left: 20,
    top: 10,
    shrink: true,
    name: 'cancel',
    content: 'cancel',
    style: {
      bg: 'blue',
      focus: {
        bg: 'red'
      },
      hover: {
        bg: 'red'
      }
    }
  });

  textInput.on('press', ()=>{
    textInput.focus();
  });

  tagInput.on('press', ()=>{
    tagInput.focus();
  });

  submit.on('press', function() {
    form.submit();
  });
  
  cancel.on('press', function() {
    createEntryTree(grid,screen,pfm);
    screen.render();
  });
  
  form.on('submit', async(data)=> {
    
    const contentHash = await pfm.upload(data.Text);
    const tags = _.split(data.Tags, ',');
    _.forEach(tags, async tag => {
      await pfm.link(contentHash, tag);
    }); 

    form.setContent('Submitted.');
    
    screen.render();
  });

  textInput.focus();
  screen.render();
  return form;
}

// form for exploring content, should only return a input for tags and return all message linked with that tag
const createExploreForm = (screen,grid,pfm) => {
  const form = grid.set(0, 0, 1, 1, blessed.form, 
  { keys: true
  , fg: 'green'
  , label: 'Explore'
  , columnWidth: [24, 10, 10]})
  
  const tagInput = blessed.textbox({
    parent: form,
    name: 'Tag',
    input: true,
    mouse: true,
    keys: true,
    top: 5,
    left: 5,
    height: 1,
    width: '30%',
    style: {
      fg: 'white',
      bg: 'black',
      focus: {
          bg: 'red',
          fg: 'white'
      }
    }
  });

  const tagInputLabel = blessed.text({
    parent: form,
    top: 5,
    left: 0,
    content: 'Tag:'
  });
  
  const submit = blessed.button({
    parent: form,
    mouse: true,
    keys: true,
    shrink: true,
    padding: {
      left: 1,
      right: 1
    },
    left: 10,
    top: 10,
    shrink: true,
    name: 'submit',
    content: 'submit',
    style: {
      bg: 'blue',
      focus: {
        bg: 'red'
      },
      hover: {
        bg: 'red'
      }
    }
  });
  
  const cancel = blessed.button({
    parent: form,
    mouse: true,
    keys: true,
    shrink: true,
    padding: {
      left: 1,
      right: 1
    },
    left: 20,
    top: 10,
    shrink: true,
    name: 'cancel',
    content: 'cancel',
    style: {
      bg: 'blue',
      focus: {
        bg: 'red'
      },
      hover: {
        bg: 'red'
      }
    }
  });

  tagInput.on('press', ()=>{
    tagInput.focus();
  })
  submit.on('press', function() {
    form.submit();
  });
  
  cancel.on('press', function() {
    createEntryTree(grid,screen, pfm);
    screen.render();
  });
  
  form.on('submit', async(data)=> {
    let tag = data.Tag;
    if (tag === '') tag = pfm.publicKey;
    let taggedHashes = await pfm.retrieveLinks(tag);

    if (taggedHashes === false) {
      taggedHashes = 'No hashes found under that tag.'
      form.setContent(taggedHashes.toString());
    }else {
      taggedTable( grid, screen , taggedHashes, pfm, tag);
    }
    
    // screen.render();
  });

  tagInput.focus();
  screen.render();
  return form;
}


module.exports = tui;