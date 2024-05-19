export const state = {};

export const setState = (key, value) => {
  const keys = key.split('.');
  let current = state;
  keys.slice(0, -1).forEach(k => {
    if (!current[k]) current[k] = {};
    current = current[k];
  });
  current[keys[keys.length - 1]] = value;
};

export const getState = (key) => {
  const keys = key.split('.');
  let current = state;
  for (const k of keys) {
    if (current[k] === undefined) return undefined;
    current = current[k];
  }
  return current;
};

export const clearState = () => {
  Object.keys(state).forEach(key => delete state[key]);
};
