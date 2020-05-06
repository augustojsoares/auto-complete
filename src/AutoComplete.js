import React, { Component } from 'react';

import { KEY_ENTER, KEY_UP, KEY_DOWN, KEY_ESCAPE, NETWORK_DELAY } from './constants';

import './AutoComplete.css';
class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      matchingHints: [],
      activeHintIndex: 0,
      activeFetch: null,
      isFetching: false,
      isDone: true
    };
  }

  buildRegex = input => new RegExp(`(${input.trim().replace(/(\W)/gi, match => '\\' + match)})`, 'gi');

  setResult = hint =>
    this.setState({
      activeHintIndex: 0,
      matchingHints: [],
      input: hint,
      isDone: true,
      isFetching: false
    });

  hideHints = () =>
    this.setState({
      activeHintIndex: 0,
      matchingHints: [],
      isDone: true
    });

  filterHints = value => {
    const {
      props: { hints },
      buildRegex,
      state: { activeFetch }
    } = this;

    clearTimeout(activeFetch);

    return new Promise(resolve => {
      const activeFetch = setTimeout(() => {
        resolve(value.length !== 0 ? hints.filter(hint => buildRegex(value).test(hint)) : []);
      }, NETWORK_DELAY);

      this.setState({ activeFetch });
    });
  };

  handleOnChange = ({ target: { value } }) => {
    const { state, filterHints } = this;

    const before = new Date();
    this.setState({ ...state, input: value, isFetching: true, isDone: false }, () => {
      const after = new Date();
      console.log(after - before);
      filterHints(value).then(matchingHints => {
        this.setState({
          ...this.state,
          matchingHints,
          isFetching: false,
          activeHintIndex: 0
        });
      });
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

  renderHint = (hint, index) => {
    const {
      state: { input, activeHintIndex }
    } = this;

    const parts = hint.split(this.buildRegex(input));
    return (
      <li
        key={hint}
        id={`hint-${index}`}
        className={`hint ${index === activeHintIndex ? 'selected' : ''}`}
        onClick={this.handleOnClick}
      >
        {parts.map((part, index) =>
          part.toLowerCase() === input.trim().toLowerCase() ? (
            <strong className="highlighted" key={`${hint}-part-${index}`}>
              {part}
            </strong>
          ) : (
            part
          )
        )}
      </li>
    );
  };

  render = () => {
    const {
      handleOnChange,
      handleOnKeyDown,
      renderHint,
      state: { input, matchingHints, isFetching, isDone }
    } = this;
    return (
      <div className="auto-complete">
        <div className="input-box">
          <input type="text" value={input} onChange={handleOnChange} onKeyDown={handleOnKeyDown} />
        </div>
        {matchingHints.length ? (
          <ul className="hint-box">{matchingHints.map(renderHint)}</ul>
        ) : (
          (input.length !== 0 && !isFetching && !isDone && <span className="tip">No matches!</span>) ||
          (input.length === 0 && !isFetching && <span className="tip">Start typing to see hints</span>)
        )}
      </div>
    );
  };
}
export { AutoComplete };
