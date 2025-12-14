module.exports = (temp, product) => {
  //output is the updated temp html file but with ALL(g) PRODUCTNAMES being replaced with the object[0]'s productName.
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  //now output is the updated html file with productname changed and product image and so on for the rest.
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  //finally output is the fully changed template html for the first object. the will be five of these html templates. one for each element in the map array.
  return output;
};
