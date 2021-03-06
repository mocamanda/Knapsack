const fs = require('fs');
const argv = process.argv.slice(2);
/*
  Strategy 1
  0. Go through our items and filter out any items whose size > knapsack's capacity
  1. 'Score' each item by determining its value/weight ratio
  2. Sort the items array by each item's ratio such that the items with the best ratio
  are at the top of the array of items
  3. Grab items off the top of the items array until we reach out knapsack's full capacity
*/

/*  AMANDA'S SOLUTION  */

function naiveKnapsack(items, capacity) {
  // go through each obj
  // divide its size / value
  // store ratios
  let ratioArr = [];
  for (let i = 0; i < items.length; i++) {
    // console.log('item at index', items[i].index, items[i].size, 'size');
    // console.log('ratio', items[i].size / items[i].value);
    ratioArr[items[i].index] = {
      index: items[i].index,
      ratio: items[i].size / items[i].value,
      size: items[i].size,
      value: items[i].value,
    };
  }
  ratioArr.shift();

  // order ratios
  const sortByRatio = ratioArr.slice(0);
  sortByRatio.sort((a, b) => {
    return a.ratio - b.ratio;
  });
  console.log('sortbyratio', sortByRatio);

  // Items to select: 2, 8, 10
  // Total cost: 98
  // Total value: 117

  const initKnapsack = {
    initValue: 0,
    initCost: 0,
    itemsSelected: [],
  };

  let sack = capacity;
  let value = 0;
  while (sack >= 0) {
    for (let obj of sortByRatio) {
      if (sack - obj.size > 0) {
        sack -= obj.size;
        value += obj.value;
        initKnapsack.itemsSelected.push(obj.index);
        filledKnapsack = {
          ...initKnapsack,
          Value: value,
          Size: capacity - sack,
        };
      }
    }
    return filledKnapsack;
  }
  // go through each ratio
  // while capacity under
  // hold ratio index

  // return items meeting knapsack reqs
  return 'KNAPSACK SUCCESS';
}

if (argv.length !== 2) {
  console.error("usage: filename capacity");
  process.exit(1);
}

const filename = argv[0];
const capacity = argv[1];

// Read the File
const filedata = fs.readFileSync(filename, "utf8");

// Split the filedata on each new line
const lines = filedata.trim().split(/[\r\n]+/g);

// Process the lines
const items = [];

for (let l of lines) {
  const [index, size, value] = l.split(" ").map(n => parseInt(n));

  items[index] = {
    index,
    size,
    value,
  };
}

items.shift();

console.log("Naive Recursive implementation: ", naiveKnapsack(items, capacity));




/*  SEAN's SOLUTION  */

// const fs = require('fs');

// /*  NAIVE RECURSIVE APPROACH  */
// function naiveKnapsack(items, capacity) {
//   function recurse(i, size) {
//     // base case
//     if (i === -1) {
//       return {
//         value: 0,
//         size: 0,
//         chosen: [],
//       };
//     }

//     // check to see if the item fits
//     else if (items[i].size > size) {
//       return recurse(i - 1, size);
//     }
//     // Item fits, but might not be worth as much as items in there already
//     else {
//       const r0 = recurse(i - 1, size);
//       const r1 = recurse(i - 1, size - items[i].size);

//       r1.value += items[i].value;

//       if (r0.value > r1.value) {
//         return r0;
//       } else {
//         r1.size += items[i].size;
//         r1.chosen = r1.chosen.concat(i+1);
//         return r1;
//       }
//     }
//   }
//   return recurse(items.length - 1, capacity);
// }

/*
  MEMOIZED RECURSIVE / DYNAMIC PROGRAMMING STRATEGY  
  The idea: we'll use the same naive recursive logic but augment it
  with the ability to save work we've already done. This doesn't actually
  improve the theoretical runtime complexity 
*/

// function memoizedKnapsack(items, capacity) {
//   //initialize cache (in this, it will be a matrix)
//   const cache = Array(items.length);

//   // add the second dimension
//   for (let i = 0; i < items.length; i++) {
//     cache[i] = Array(capacity + 1).fill(null);
//   }

//   function recurseMemo(i, size) {
//     let value = cache[i][size];

//     if (!value) {
//       value = recurseNaive(i ,size);
//       cache[i][size] = value;
//     }
//     return value;
//   }
//   function recurseNaive(i, size) {
//         if (i === -1) {
//           return {
//             value: 0,
//             size: 0,
//             chosen: [],
//           };
//         }
    
//         else if (items[i].size > size) {
//           return recurseMemo(i - 1, size);
//         }
//         else {
//           const r0 = recurseMemo(i - 1, size);
//           const r1 = recurseMemo(i - 1, size - items[i].size);
    
//           r1.value += items[i].value;
    
//           if (r0.value > r1.value) {
//             return r0;
//           } else {
//             r1.size += items[i].size;
//             r1.chosen = r1.chosen.concat(i+1);
//             return r1;
//           }
//         }
//       }
//       return recurseMemo(items.length - 1, capacity);
// }

/*
  Greedy Strategy
  0. Go through our items and filter out any items whose size > knapsack's capacity
  1. 'Score' each item by determining its value/weight ratio
  2. Sort the items array by each item's ratio such that the items with the best ratio
  are at the top of the array of items
  3. Grab items off the top of the items array until we reach our knapsack's full capacity
*/
// const greedyAlgo = (items, capacity) => {
//   const result = {
//     size: 0,
//     value: 0,
//     chosen: [],
//   };

//   // items = items.filter(item => item.size < capacity);
//   items.sort((i1, i2) => {
//     const r1 = i1.value / i1.size;
//     const r2 = i2.value / i2.size;

//     return r2 - r1;
//   });
//   // loop through our items array, checking to see if the
//   // item's size <= our total capacity
//   for (let i = 0; i < items.length; i++) {
//     if (items[i].size <= capacity) {
//       // if it is, add it to our final result
//       result.size += items[i].size;
//       result.value += items[i].value;
//       result.chosen.push(items[i].index);
//       // don't forget to decrement our total capacity
//       capacity -= items[i].size;
//     }
//   }

//   return result;
// };

// const argv = process.argv.slice(2);

// if (argv.length != 2) {
//   console.error("usage: filename capacity");
//   process.exit(1);
// }

// const filename = argv[0];
// const capacity = parseInt(argv[1]);

// // Read the file
// const filedata = fs.readFileSync(filename, "utf8");
// // Split the filedata on each new line
// const lines = filedata.trim().split(/[\r\n]+/g);

// // Process the lines
// const items = [];

// for (let l of lines) {
//   const [index, size, value] = l.split(" ").map(n => parseInt(n));

//   items.push({
//     index: index,
//     size: size,
//     value: value,
//   });
// }

// console.log(greedyAlgo(items, capacity));
// console.log(naiveKnapsack(items, capacity));
// console.log(memoizedKnapsack(items, capacity));