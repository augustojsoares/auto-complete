const KEY_ENTER = 13;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_ESCAPE = 27;

const NETWORK_DELAY = 100;

// number between 0 and 1 that determines how often the network requests should "fail"
// 0 is NO requests fail. 1 is ALL requests fail
const NETWORK_FAIL_RATE = 0.05; // 0.05 averages to 1 failure every 20 requests

export { KEY_ENTER, KEY_UP, KEY_DOWN, KEY_ESCAPE, NETWORK_DELAY, NETWORK_FAIL_RATE };
