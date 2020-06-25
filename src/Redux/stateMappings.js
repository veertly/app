// To be used when we cannot use useSelector hook, for non react components
const stateMapping = (state) => ({
  eventSession: state.eventSession,
});

export default stateMapping;
