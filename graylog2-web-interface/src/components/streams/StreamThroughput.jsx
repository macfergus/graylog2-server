import React from 'react';
import Reflux from 'reflux';

import MetricsStore from 'stores/metrics/MetricsStore';
import MetricsActions from 'actions/metrics/MetricsActions';

import { Spinner } from 'components/common';

const StreamThroughput = React.createClass({
  propTypes: {
    streamId: React.PropTypes.string.isRequired,
  },
  mixins: [Reflux.connect(MetricsStore)],
  componentWillMount() {
    MetricsActions.addGlobal(this._metricName());
  },
  _metricName() {
    return "org.graylog2.plugin.streams.Stream." + this.props.streamId + ".incomingMessages.1-sec-rate";
  },
  _calculateThroughput() {
    return Object.keys(this.state.metrics)
      .map(nodeId => {
        const metricDefinition = this.state.metrics[nodeId][this._metricName()];
        return metricDefinition !== undefined ? metricDefinition.metric.value : 0;
      })
      .reduce((throughput1, throughput2) => throughput1 + throughput2);
  },
  render() {
    if (!this.state.metrics) {
      return <Spinner />;
    }
    return (
      <span>{this._calculateThroughput()} messages/second</span>
    );

  }
});

module.exports = StreamThroughput;
