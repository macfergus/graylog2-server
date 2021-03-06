import React, {PropTypes} from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';

import { EntityListItem, IfPermitted, LinkToNode } from 'components/common';

import Routes from 'routing/Routes';

const NodeListItem = React.createClass({
  propTypes: {
    node: PropTypes.object.isRequired,
  },
  render() {
    const node = this.props.node;
    const title = <LinkToNode nodeId={node.node_id}/>;

    const actions = [];

    actions.push(
      <LinkContainer key={`details-${node.node_id}`} to={Routes.SYSTEM.NODES.SHOW(node.node_id)}>
        <Button bsStyle="info">Details</Button>
      </LinkContainer>
    );

    actions.push(
      <LinkContainer key={`metrics-${node.node_id}`} to={Routes.SYSTEM.METRICS(node.node_id)}>
        <Button bsStyle="info">Metrics</Button>
      </LinkContainer>
    );

    actions.push(
      <Button key={`api-browser-${node.node_id}`} bsStyle="info" href={`${node.transport_address}api-browser`}
              target="_blank">
        <i className="fa fa-external-link"></i>&nbsp; API browser
      </Button>
    );

    actions.push(
      <DropdownButton key={`more-actions-${node.node_id}`}
                      title="More actions"
                      id={`more-actions-dropdown-${node.node_id}`}
                      pullRight>
        <IfPermitted permissions="processing:changestate">
          <MenuItem>Pause message processing</MenuItem>
        </IfPermitted>

        <IfPermitted permissions="lbstatus:change">
          <li className="dropdown-submenu left-submenu">
            <a href="#">Override LB status</a>
            <ul className="dropdown-menu">
              <MenuItem>ALIVE</MenuItem>
              <MenuItem>DEAD</MenuItem>
            </ul>
          </li>
        </IfPermitted>

        <IfPermitted permissions="node:shutdown">
          <MenuItem>Graceful shutdown</MenuItem>
        </IfPermitted>

        <IfPermitted permissions={['processing:changestate', 'lbstatus:change', 'node:shutdown']} anyPermissions>
          <IfPermitted permissions={['inputs:read', 'threads:dump']} anyPermissions>
            <MenuItem divider/>
          </IfPermitted>
        </IfPermitted>

        <IfPermitted permissions="inputs:read">
          <MenuItem>Local message inputs</MenuItem>
        </IfPermitted>
        <IfPermitted permissions="threads:dump">
          <MenuItem>Get thread dump</MenuItem>
        </IfPermitted>
      </DropdownButton>
    );

    return (
      <EntityListItem key={`entry-list-${node.node_id}`}
                      title={title}
                      actions={actions}/>
    );
  },
});

export default NodeListItem;
