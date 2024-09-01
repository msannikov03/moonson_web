import React from "react";
import { CartContext } from "./CartContext";

const withContext = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => (
    <CartContext.Consumer>
      {context => <WrappedComponent {...props} context={context} />}
    </CartContext.Consumer>
  );
};

export default withContext;