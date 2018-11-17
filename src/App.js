import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css';
import * as d3 from 'd3'
import graph from './data/graph.json';

class App extends Component {
  svg = null
  link = null
  node = null
  label = null
  simulation = null
  componentDidMount() {
    this.svg = d3.select("svg")
    const width = +this.svg.attr("width")
    const height = +this.svg.attr("height")
    this.simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function (d, i) { return i; }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    this.link = this.svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")

    this.node = this.svg.append("g")
      .selectAll("g")
      .data(graph.nodes)
      .enter().append("g")
      .call(d3.drag()
        .on("start", this.dragstarted)
        .on("drag", this.dragged)
        .on("end", this.dragended));

    this.circles = this.node.append("circle")
      .attr("r", 5)
      .attr("class", "nodes")
      .attr("fill", function (d) {
        switch (d.type) {
          case 'User':
            return 'green';
          case 'Tag':
            return 'blue';
          case 'Link':
          default:
            return 'yellow';
        }
      })

    this.lables = this.node.append("text")
      .text(function (d) {
        return d.name;
      })
      .attr('x', 6)
      .attr('y', 3);

    this.simulation
      .nodes(graph.nodes)
      .on("tick", this.ticked);

    this.simulation.force("link")
      .links(graph.links);
  }
  ticked = () => {
    this.link
      .attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });

    this.node
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
  }
  dragstarted = (d) => {
    if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged = (d) => {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  dragended = (d) => {
    if (!d3.event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <svg width='200' height='200'></svg>
        </header>
      </div>
    );
  }
}

export default App;
