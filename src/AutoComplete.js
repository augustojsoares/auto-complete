import React, { Component } from 'react';

import { KEY_ENTER, KEY_UP, KEY_DOWN, KEY_ESCAPE, NETWORK_DELAY } from './constants';

class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      matchingHints: [],
      activeHintIndex: 0
    };
  }

  setResult = hint =>
    this.setState({
      activeHintIndex: 0,
      matchingHints: [],
      input: hint
    });

  hideHints = () =>
    this.setState({
      activeHintIndex: 0,
      showSuggestions: false,
      matchingHints: []
    });

  handleOnChange = ({ target: { value } }) => {
    this.setState({
      ...this.state,
      input: value,
      matchingHints: value.length === 0 ? [] : this.props.hints.filter(hint => RegExp(value, 'gi').test(hint))
    });
  };

  handleOnClick = ({ target: { innerText } }) => this.setResult(innerText);

  handleOnKeyDown = ({ keyCode }) => {
    const {
      state: { activeHintIndex, matchingHints },
      setResult,
      hideHints
    } = this;

    switch (keyCode) {
      case KEY_ENTER:
        if (matchingHints.length) {
          setResult(matchingHints[activeHintIndex]);
        }
        break;

      case KEY_UP:
        if (activeHintIndex !== 0) {
          this.setState({ activeHintIndex: activeHintIndex - 1 });
        }
        break;

      case KEY_DOWN:
        if (activeHintIndex < matchingHints.length - 1) {
          this.setState({ activeHintIndex: activeHintIndex + 1 });
        }
        break;

      case KEY_ESCAPE:
        hideHints();
        break;
      default:
        return;
    }
  };

  render = () => {
    const {
      handleOnChange,
      handleOnClick,
      handleOnKeyDown,
      state: { input, matchingHints, activeHintIndex }
    } = this;
    return (
      <div className="auto-complete">
        <div className="input-box">
          <input type="text" value={input} onChange={handleOnChange} onKeyDown={handleOnKeyDown} />
        </div>
        {!!matchingHints.length && (
          <ul>
            {matchingHints.map((hint, index) => (
              <li key={hint} className={`hint ${index === activeHintIndex ? 'selected' : ''}`} onClick={handleOnClick}>
                {hint}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
}
export { AutoComplete };
