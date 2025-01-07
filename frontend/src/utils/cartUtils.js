export const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };
  
  export const updateCart = (state) => {
    // Calculate the items price
    state.itemsPrice = addDecimals(
      state.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    );
  
    // Calculate the shipping price
    state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10); //this isnt working

    // Calculate the tax price
    state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));
  
    // Calculate the total price
    state.totalPrice = (
      Number(state.itemsPrice) + //ensures that itemprice is a number ( basically thats what the Number method does)
      Number(state.shippingPrice) +
      Number(state.taxPrice)
    ).toFixed(2);
  
    localStorage.setItem("cart", JSON.stringify(state));

    
  
    return state;
  };