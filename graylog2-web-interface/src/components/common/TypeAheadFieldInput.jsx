import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import { Input } from 'react-bootstrap';
import $ from 'jquery';
import Typeahead from 'typeahead.js'; // Need to import this to load typeahead, even if the variable is never used

import UniversalSearch from 'logic/search/UniversalSearch';

import jsRoutes from 'routing/jsRoutes';
import URLUtils from 'util/URLUtils';
import fetch from 'logic/rest/FetchProvider';

const TypeAheadFieldInput = React.createClass({
  propTypes: {
    valueLink: PropTypes.object,
    autoFocus: PropTypes.bool,
    onChange: PropTypes.func,
  },
  componentDidMount() {
    if (this.refs.fieldInput) {
      const fieldInput = $(this.refs.fieldInput.getInputDOMNode());
      fetch('GET', URLUtils.qualifyUrl(jsRoutes.controllers.api.SystemApiController.fields().url))
        .then(
          (data) => {
            fieldInput.typeahead(
              {
                hint: true,
                highlight: true,
                minLength: 1,
              },
              {
                name: 'fields',
                displayKey: 'value',
                source: UniversalSearch.substringMatcher(data.fields, 'value', 6),
              });

            if (this.props.autoFocus) {
              fieldInput.focus();
              fieldInput.typeahead('close');
            }
          });

      const fieldFormGroup = ReactDOM.findDOMNode(this.refs.fieldInput);
      $(fieldFormGroup).on('typeahead:change typeahead:selected', (event) => {
        if (this.props.onChange) {
          this.props.onChange(event);
        }
        if (this.props.valueLink) {
          this.props.valueLink.requestChange(event.target.value);
        }
      });
    }
  },
  componentWillUnmount() {
    if (this.refs.fieldInput) {
      const fieldInput = $(this.refs.fieldInput.getInputDOMNode());
      fieldInput.typeahead('destroy');
      const fieldFormGroup = ReactDOM.findDOMNode(this.refs.fieldInput);
      $(fieldFormGroup).off('typeahead:change typeahead:selected');
    }
  },

  _getFilteredProps() {
    let props = Immutable.fromJS(this.props);

    ['valueLink', 'onChange'].forEach((key) => {
      if (props.has(key)) {
        props = props.delete(key);
      }
    });

    return props.toJS();
  },

  render() {
    return (
      <Input ref="fieldInput"
             wrapperClassName="typeahead-wrapper"
             defaultValue={this.props.valueLink ? this.props.valueLink.value : null}
        {...this._getFilteredProps()}/>
    );
  },
});

export default TypeAheadFieldInput;
