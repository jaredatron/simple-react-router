import React from 'react';

const withRedirectTo = Component => {
  const WithRedirectTo = (props, context) => (
    <Component {...props} redirectTo={context.redirectTo} />
  );

  WithRedirectTo.contextTypes = { redirectTo: () => null };
  return WithRedirectTo;
};

export default withRedirectTo;
