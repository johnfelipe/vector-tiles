import md from '@mapbox/batfish/modules/md';

export const encodingGeometrySteps = [
  {
    name: 'Step 0',
    description: md`
      The vector tile to the left is a 10x10 grid with 2 cell buffer. Let\'s encode some geometry to the grid starting with a <span class="bg-blue-faint color-blue inline-block px6 py3 txt-xs txt-bold round-full">blue polygon</span>. The following commands will be relative to the <span class="bg-black color-white inline-block px6 py3 txt-xs txt-bold round-full">pen</span> (black dot).
    `,
    commandx: 'An empty vector tile',
    command: function(ctx, cmd, grid) {}, // eslint-disable-line no-unused-vars
    pen: function(cmd) {} // eslint-disable-line no-unused-vars
  },
  {
    name: 'Step 1',
    color: '#4264fb',
    description: md`
The first action when encoding a polygon is to point the command to a starting point. This uses the \`MoveTo(x,y)\` command. The <span className='bg-black color-white inline-block px6 py3 txt-xs txt-bold round-full'>pen</span> is at \`1, 2\` starting at the top left of the grid
    `,
    commandx: 'MoveTo(1,2)',
    buttonText: 'Next step',
    command: function(ctx, cmd, grid) {}, // eslint-disable-line no-unused-vars
    pen: function(cmd) {
      cmd.pen(1, 2);
    }
  },
  {
    name: 'Step 2',
    color: '#4264fb',
    description: md`
In order to move from a starting position, we use a <code>LineTo(x,y)</code> command. The X and Y values are relative to the previous command, rather than the origin of the grid, to keep file size down.
    `,
    commandx: 'LineTo(3,-1)',
    buttonText: 'Next step',
    command: function(ctx, cmd, grid) {
      // eslint-disable-line no-unused-vars
      ctx.strokeStyle = '#4264fb';
      ctx.beginPath();
      cmd.mt(1, 2);
      cmd.lt(4, 1);
      ctx.stroke();
    },
    pen: function(cmd) {
      cmd.pen(4, 1);
    }
  },
  {
    name: 'Step 3',
    color: '#4264fb',
    description: md`
Drawing another path of the <span className='bg-blue-faint color-blue inline-block px6 py3 txt-xs txt-bold round-full'>blue polygon</span>.
    `,
    commandx: 'LineTo(3,4)',
    buttonText: 'Next step',
    command: function(ctx, cmd, grid) {
      // eslint-disable-line no-unused-vars
      ctx.strokeStyle = '#4264fb';
      ctx.beginPath();
      cmd.mt(4, 1);
      cmd.lt(7, 5);
      ctx.stroke();
    },
    pen: function(cmd) {
      cmd.pen(7, 5);
    }
  },
  {
    name: 'Step 4',
    color: '#4264fb',
    description: md`
Drawing another path of the <span className='bg-blue-faint color-blue inline-block px6 py3 txt-xs txt-bold round-full'>blue polygon</span>.
    `,
    commandx: 'LineTo(-4,2)',
    buttonText: 'Next step',
    command: function(ctx, cmd, grid) {
      // eslint-disable-line no-unused-vars
      ctx.strokeStyle = '#4264fb';
      ctx.beginPath();
      cmd.mt(7, 5);
      cmd.lt(3, 7);
      ctx.stroke();
    },
    pen: function(cmd) {
      cmd.pen(3, 7);
    }
  },
  {
    name: 'Step 5',
    color: '#4264fb',
    description: md`
Finally, we close a path. This uses the <code>ClosePath()</code> command that closes the path to most recently used <code>MoveTo(x,y)</code> command, which is our starting point.<br><br>This DOES NOT move the <span className='bg-black color-white inline-block px6 py3 txt-xs txt-bold round-full'>pen</span>.
    `,
    commandx: 'ClosePath()',
    buttonText: 'Next step',
    command: function(ctx, cmd, grid) {
      // eslint-disable-line no-unused-vars
      ctx.strokeStyle = '#4264fb';
      ctx.beginPath();
      cmd.mt(3, 7);
      cmd.lt(1, 2);
      ctx.stroke();
    },
    pen: function(cmd) {
      cmd.pen(3, 7);
    }
  },
  {
    name: 'Step 6',
    color: '#ee4e8b',
    description: md`
Now on to the <span className='bg-pink-faint color-pink inline-block px6 py3 txt-xs txt-bold round-full'>pink polygon</span>. This requires another <code>MoveTo</code> command relative to the last <code>LineTo</code> of the previous polygon.
    `,
    commandx: 'MoveTo(1,-5)',
    buttonText: 'Next step',
    command: function() {},
    pen: function(cmd) {
      cmd.pen(4, 2);
    }
  },
  {
    name: 'Step 7',
    color: '#ee4e8b',
    description: md`
Since the <span className='bg-pink-faint color-pink inline-block px6 py3 txt-xs txt-bold round-full'>pink polygon</span> is technically a \"hole\" of the <span className='bg-blue-faint color-blue inline-block px6 py3 txt-xs txt-bold round-full'>blue polygon</span> it is considered an <em>interior ring</em>. The Mapbox Vector Tile Specification requires this interior ring to be drawn counter-clockwise, opposite of the <span className='bg-blue-faint color-blue inline-block px6 py3 txt-xs txt-bold round-full'>blue polygon</span>.
    `,
    commandx: 'LineTo(-1,2)',
    buttonText: 'Next step',
    command: function(ctx, cmd, grid) {
      // eslint-disable-line no-unused-vars
      ctx.strokeStyle = '#ee4e8b';
      ctx.beginPath();
      cmd.mt(4, 2);
      cmd.lt(3, 4);
      ctx.stroke();
    },
    pen: function(cmd) {
      cmd.pen(3, 4);
    }
  },
  {
    name: 'Step 7',
    color: '#ee4e8b',
    description: md`
Another addition to the <span className='bg-pink-faint color-pink inline-block px6 py3 txt-xs txt-bold round-full'>pink polygon</span>.
    `,
    commandx: 'LineTo(2,1)',
    buttonText: 'Next step',
    command: function(ctx, cmd, grid) {
      // eslint-disable-line no-unused-vars
      ctx.strokeStyle = '#ee4e8b';
      ctx.beginPath();
      cmd.mt(3, 4);
      cmd.lt(5, 5);
      ctx.stroke();
    },
    pen: function(cmd) {
      cmd.pen(5, 5);
    }
  },
  {
    name: 'Step 7',
    color: '#ee4e8b',
    description: md`
Finally, we close the <span className='bg-pink-faint color-pink inline-block px6 py3 txt-xs txt-bold round-full'>pink polygon</span> by drawing back to the most recent <code>MoveTo()</code> command.
    `,
    commandx: 'ClosePath()',
    buttonText: 'Next step',
    command: function(ctx, cmd, grid) {
      // eslint-disable-line no-unused-vars
      ctx.strokeStyle = '#ee4e8b';
      ctx.beginPath();
      cmd.mt(5, 5);
      cmd.lt(4, 2);
      ctx.stroke();
    },
    pen: function(cmd) {
      cmd.pen(5, 5);
    }
  },
  {
    name: 'Fin.',
    color: '#ee4e8b',
    description: md`
Encoding is complete! Now if we render the vector tile, you'll notice the <span className='bg-blue-faint color-blue inline-block px6 py3 txt-xs txt-bold round-full'>blue polygon</span> has a hole (interior ring) represented by the <span className='bg-pink-faint color-pink inline-block px6 py3 txt-xs txt-bold round-full'>pink polygon</span>'s opposite winding order.<br><br>Encoding a single vector tile into <code>.mvt</code> format happens quickly with tools like Mapnik or Node Mapnik. It's important to keep in mind that geometry coordinates are translated into non-geographic vector grid coordinates, which results in some simplification. In order to reduce the visual impact, vector tiles are rendered to a maximum zoom level. Once you hit that zoom level, another tile is loaded with more detail.
    `,
    commandx: '',
    buttonText: 'Start over',
    command: function(ctx, cmd, grid, padding) {
      // eslint-disable-line no-unused-vars
      grid.style.opacity = 0;
      // clear canvas
      setTimeout(function() {
        ctx.clearRect(0, 0, grid.width, grid.height);

        // draw border
        ctx.fillRect(padding, padding, ctx.canvas.width, ctx.canvas.height);

        // draw blue square
        ctx.fillStyle = '#4264fb';
        ctx.beginPath();
        cmd.mt(1, 2);
        cmd.lt(4, 1);
        cmd.lt(7, 5);
        cmd.lt(3, 7);
        ctx.closePath();
        ctx.fill();

        // draw blue square
        ctx.fillStyle = '#e5e5e5';
        ctx.beginPath();
        cmd.mt(4, 2);
        cmd.lt(3, 4);
        cmd.lt(5, 5);
        ctx.closePath();
        ctx.fill();

        // set opacity back on canvas
        grid.style.opacity = 1;
      }, 1200);
      // draw border OR transparent grid
      // draw blue square, fill blue
      // draw red square, fill white
    },
    pen: function() {}
  }
];
