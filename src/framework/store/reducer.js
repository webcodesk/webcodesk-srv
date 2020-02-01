export default function universalReducer (state = {}, action) {
  const { payload, type } = action;
  return { ...state, ...{ [type]: { ...state[type], ...payload } } };
};
