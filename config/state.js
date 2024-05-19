const state = {};

const setState = (key, value) => {
  const keys = key.split('.');
  let current = state;
  keys.slice(0, -1).forEach(k => {
    if (!current[k]) current[k] = {};
    current = current[k];
  });
  current[keys[keys.length - 1]] = value;
};

const getState = (key) => {
  const keys = key.split('.');
  let current = state;
  for (const k of keys) {
    if (current[k] === undefined) return undefined;
    current = current[k];
  }
  return current;
};

const clearState = () => {
  Object.keys(state).forEach(key => delete state[key]);
};

module.exports = {
  setState,
  getState,
  clearState
};
