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
  componentDidMount() {
    this.svg = d3.select("svg")
    const width = +this.svg.attr("width")
    const height = +this.svg.attr("height")

    const simulation = d3.forceSimulation()
      .force("charge", d3.forceManyBody().strength(-200))
      .force("link", d3.forceLink().id(function (d) { return d.id; }).distance(40))
      .force("x", d3.forceX(width / 2))
      .force("y", d3.forceY(height / 2))
      .on("tick", this.ticked);

    this.link = this.svg.selectAll(".link")
    this.node = this.svg.selectAll(".node")

    simulation.nodes(graph.nodes);
    simulation.force("link").links(graph.links);

    this.link = this.link
      .data(graph.links)
      .enter().append("line")
      .attr("class", "link");

    this.node = this.node
      .data(graph.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 6)
      .style("fill", function (d) {
        switch (d.type) {
          case 'User':
            return 'blue';
          case 'Tag':
            return 'red';
          case 'Link':
          default:
            return 'yellow';
        }
      });
  }
  ticked = () => {
    this.link.attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });

    this.node.attr("cx", function (d) { return d.x; })
      .attr("cy", function (d) { return d.y; });
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
