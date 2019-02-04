/* @flow */
import React from 'react';
import Button from '@mapbox/mr-ui/button';
import { EncodingGeometryGrid } from './encoding-geometry-grid';
import { encodingGeometrySteps } from '../../data/encoding-geometry-steps';

class EncodingGeometryDiagram extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      stepIndex: 0
    };
  }

  render() {
    const commandContents = encodingGeometrySteps
      .filter((step, i) => {
        return i <= this.state.stepIndex && i !== 0;
      })
      .map((step, i) => {
        return (
          <div key={i} style={{ color: step.color }}>
            {step.commandx}
          </div>
        );
      });

    return (
      <div className="grid mt36">
        <div className="col--6-mm col--12 pr24-mm pr0 mb0-mm mb24">
          <div className="txt-bold txt-s">
            {encodingGeometrySteps[this.state.stepIndex].name}
          </div>
          <div className="txt-l mb12">
            {encodingGeometrySteps[this.state.stepIndex].commandx}
          </div>
          <div>{encodingGeometrySteps[this.state.stepIndex].description}</div>
          <div className="mt24">
            <Button
              onClick={() => {
                this.setState({
                  stepIndex:
                    this.state.stepIndex < encodingGeometrySteps.length - 1
                      ? this.state.stepIndex + 1
                      : 0
                });
              }}
              corners={true}
            >
              {this.state.stepIndex === encodingGeometrySteps.length - 1
                ? 'Restart'
                : 'Next step'}
            </Button>
          </div>
        </div>
        <div className="col--6-mm col--12">
          <div className="mx-auto">
            <EncodingGeometryGrid
              currentStep={this.state.stepIndex}
              command={
                encodingGeometrySteps[
                  this.state.stepIndex < encodingGeometrySteps.length - 1
                    ? this.state.stepIndex + 1
                    : 0
                ].command
              }
              pen={
                encodingGeometrySteps[
                  this.state.stepIndex < encodingGeometrySteps.length - 1
                    ? this.state.stepIndex + 1
                    : 0
                ].pen
              }
            />
          </div>
          <pre className="mx-auto" style={{ width: '211px' }}>
            {commandContents}
          </pre>
        </div>
      </div>
    );
  }
}

export { EncodingGeometryDiagram };
