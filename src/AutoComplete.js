import React, { Component } from 'react';

class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      matchingHints: []
    };
  }

  handleOnChange = ({ target: { value } }) => {
    this.setState({
      ...this.state,
      input: value,
      matchingHints: this.props.hints.filter(hint => RegExp(value, 'gi').test(hint))
    });
  };

  render = () => {
    const {
      handleOnChange,
      state: { input, matchingHints }
    } = this;
    return (
      <div className="auto-complete">
        <div className="input-box">
          <input type="text" value={input} onChange={handleOnChange} />
        </div>
        {!!matchingHints.length && (
          <ul>
            {matchingHints.map(hint => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };
}
export { AutoComplete };
