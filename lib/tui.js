const blessed = require('blessed')
const contrib = require('blessed-contrib')

const tui = (PFM) => {

  const screen = blessed.screen()
  //create layout and widgets
  const grid = new contrib.grid({rows: 1, cols: 2, screen: screen})

  const tree =  grid.set(0, 0, 1, 1, contrib.tree, 
    { style: { text: "red" }
    , template: { lines: true }
    , label: 'Filesystem Tree'})

  const table =  grid.set(0, 1, 1, 1, contrib.table, 
    { keys: true
    , fg: 'green'
    , label: 'Informations'
    , columnWidth: [24, 10, 10]})

  //file explorer
  const explorer = { name: 'Main'
    , extended: true
    // Child generation function
    , children: {
        "Create": {
          function: async()=> {return {} }
        },
        "Explore": {
          function: async()=> {return {}}
        }
      }
  }

  //set tree
  tree.setData(explorer);

  // Handling select event. Every custom property that was added to node is 
  // available like the "node.getPath" defined above
  tree.on('select', async(node)=>{
    const dataToLoad =  await node.function();

    tree.setData(dataToLoad);
    tree.focus()
    screen.render();
  });
  //set default table
  table.setData({headers: ['Info'], data: [[]]})

  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  screen.key(['tab'], function(ch, key) {
    if(screen.focused == tree.rows)
      table.focus();
    else
      tree.focus();
  });

  tree.focus()
  screen.render()

}




module.exports = tui;