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

  // this was a quick and dirty fix. With more time would probably re-implement using refs
  scrollToIndex = index => {
    const hintAtIndex = document.getElementById(`hint-${index}`);
    if (hintAtIndex) {
      hintAtIndex.scrollIntoView();
    }
  };

  // Had to do this to highlight the matches and simultaneously not having it blow up when special chars are used
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

  // Could add optimization where if the old input is a substring of the new input,
  // only filter on matchingHints since all results are already in there
  filterHints = value => {
    const {
      props: { hints },
      buildRegex,
      state: { activeFetch }
    } = this;

    // this timeout logic aims to replicate network asynchronous behavior
    // you can fiddle with the "network delay" in the constants file
    // implemented cancelation of currently unresolved requests before firing a new one
    // would probably debounce them as well for production app
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

    this.setState({ ...state, input: value, isFetching: true, isDone: false }, () => {
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
      hideHints,
      scrollToIndex
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
          scrollToIndex(activeHintIndex - 2);
        }
        break;

      case KEY_DOWN:
        if (activeHintIndex < matchingHints.length - 1) {
          this.setState({ activeHintIndex: activeHintIndex + 1 });
          scrollToIndex(activeHintIndex);
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
      hideHints,
      state: { input, matchingHints, isFetching, isDone }
    } = this;
    return (
      <div className="auto-complete">
        <div className="input-box">
          <input type="text" value={input} onChange={handleOnChange} onKeyDown={handleOnKeyDown} onBlur={hideHints} />
          {isFetching && (
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
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
