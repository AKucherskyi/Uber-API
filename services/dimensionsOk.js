module.exports = (load, truck) => {
    console.log(load, truck)
  switch (truck.type) {
    case "SPRINTER":
      if (
        load.payload > 1700 ||
        load.dimensions.length > 300 ||
        load.dimensions.height > 250 ||
        load.dimensions.width > 170
      ) {
        return false;
      } else {
        return true;
      }

    case "SMALL STRAIGHT":
      if (
        load.payload > 2500 ||
        load.dimensions.length > 500 ||
        load.dimensions.height > 250 ||
        load.dimensions.width > 170
      ) {
        return false;
      } else {
        return true;
      }

    case "LARGE STRAIGHT":
      if (
        load.payload > 4000 ||
        load.dimensions.length > 700 ||
        load.dimensions.height > 350 ||
        load.dimensions.width > 200
      ) {
        return false;
      } else {
        return true;
      }
  }
};
