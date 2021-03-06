// D3
var w = document.getElementById("treeviz").clientWidth;
w = w ? w : 560;
var margin = {top: 40, right: 0, bottom: 20, left: 0},
    width = w - margin.right - margin.left,
    height = 600 - margin.top - margin.bottom;    

var d3Tree = d3.layout.tree().size([height, width]);

var diagonal = d3.svg.diagonal();

var viz = d3.select("#viz").append("svg")
.attr("width", width + margin.right + margin.left)
.attr("height", height + margin.top + margin.bottom)
.attr("class", "viz-container")
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function D3ize(tree, n) {
  var nodes = {alpha: n || ''};
  if (Object.keys(tree).length) {
    nodes.children = [];
    for (var k in tree) {
      nodes.children.push(D3ize(tree[k], k));
    }
  }
  return nodes;
}

function GetTree(words) {
  var root = {};
  // iterate over each word in the array
  for (var i = 0; i < words.length; i++) {
    // reset to root
    var tree = root;
    // iterate over each char adding it to the tree
    for (var j = 0; j < words[i].length; j++) {
      if (tree[words[i][j]] === undefined) {
        tree[words[i][j]] = {};
      }
      tree = tree[words[i][j]];
    }
  }
  return root;
}

function visualize(words) {
  var objTree = GetTree(words);
  var tree = D3ize(objTree);
  tree.x0 = height / 2;
  tree.y0 = 0;
  update(tree);
}
  
function update(tree) {
  
  // Compute the new tree layout
  var nodes = d3Tree.nodes(tree),
      links = d3Tree.links(nodes),
      i = 0;

  // normalize for fixed-depth
  nodes.forEach(function(d) { d.y = d.depth * 40; });

  // update the nodes
  var node = viz.selectAll("g.node")
      .data(nodes, function(d) { return d.id = ++i; });
  
  // Enter any new nodes at the parent's previous position
  var nodeEnter = node.enter().append("g").attr("class", "node");

  nodeEnter.append("circle")
           .attr("r", 9);

  nodeEnter.append("text")
      .attr("x", function(d) { return 0; })
      .attr("dy", function(d) { return 4; })
      .attr("text-anchor", function(d) { return "middle"; })
      .text(function(d) { return d.alpha; });

  // transition nodes to their new position
  nodeEnter.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  
  var link = viz.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  link.enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("d", diagonal);

  link.transition()
      .duration(1000)
      .attr("d", diagonal);
  
  link.exit().remove();
  node.exit().remove();  
}


