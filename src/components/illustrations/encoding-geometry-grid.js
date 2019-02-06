/* @flow */
import React from 'react';

const cellSize = 15;
const tilesize = 12;
const padding = 1;
const buffer = 2;
const buffx = padding + buffer * cellSize;
let ctx;
const cmd = {
  mt: function(x, y) {
    ctx.moveTo(buffx + cellSize * x, buffx + cellSize * y);
  },
  lt: function(x, y) {
    ctx.lineTo(buffx + cellSize * x, buffx + cellSize * y);
  },
  pen: function(x, y) {
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.arc(buffx + cellSize * x, buffx + cellSize * y, 3, 0, 2 * Math.PI);
    ctx.fill();
  }
};
let x;
let y;

class EncodingGeometryGrid extends React.PureComponent {
  // elem is a DOM selected element
  // size is number of cells width and height
  // buffer in number of cells
  makeGrid = (canvas, size, buffer) => {
    // each cell is 10x10 pixels
    ctx = canvas.getContext('2d');
    ctx.canvas.width = cellSize * (size + buffer) + padding;
    ctx.canvas.height = cellSize * (size + buffer) + padding;
    this.drawGrid(ctx, size, buffer);
  };

  drawGrid = (c, size, buff) => {
    for (x = padding; x <= c.canvas.width + padding; x += cellSize) {
      for (y = padding; y <= c.canvas.height + padding; y += cellSize) {
        if (
          x < padding + buff * cellSize ||
          y < padding + buff * cellSize ||
          x - cellSize > cellSize * size + padding * 2 - buff * cellSize ||
          y - cellSize > cellSize * size + padding * 2 - buff * cellSize
        ) {
          c.fillStyle = '#e5e5e5';
          c.fillRect(x - 0.5, y - 0.5, cellSize, cellSize);
        }

        c.strokeStyle = '#666666';
        c.strokeRect(x - 0.5, y - 0.5, cellSize, cellSize);
      }
    }
  };

  componentDidMount() {
    this.makeGrid(this.gridContainer, tilesize, buffer);
    this.props.command(ctx, cmd, this.gridContainer, padding);
    this.props.pen(cmd);
  }

  componentDidUpdate() {
    if (this.props.currentStep === 0) {
      this.makeGrid(this.gridContainer, tilesize, buffer);
      this.props.pen(cmd);
    } else {
      this.props.command(ctx, cmd, this.gridContainer, padding);
      this.props.pen(cmd);
    }
  }

  render() {
    return (
      <div className="mx-auto align-center">
        <canvas ref={el => (this.gridContainer = el)} />
      </div>
    );
  }
}

export { EncodingGeometryGrid };
