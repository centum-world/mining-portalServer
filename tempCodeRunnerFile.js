const readlineSync = require('readline-sync');

function minOperations(N, flags) {
    // Step 1: Sort flags based on x-coordinates
    flags.sort((a, b) => a[0] - b[0]);

    // Step 2: Find the median y-coordinate
    const sortedY = flags.map(flag => flag[1]).sort((a, b) => a - b);
    const medianY = sortedY[Math.floor(N / 2)];

    // Step 3: Calculate total distance from median y-coordinate for each flag
    const totalDistance = flags.reduce((acc, flag) => acc + Math.abs(flag[1] - medianY), 0);

    // Step 4: Choose the flag with the median x-coordinate
    const medianXFlag = flags[Math.floor(N / 2)];

    // Step 5: Calculate the total cost of moving flags horizontally
    const totalCost = flags.reduce((acc, flag) => acc + Math.abs(flag[0] - medianXFlag[0]), 0);

    // Step 6: Return the total cost
    return totalCost;
}

// Example usage
const N = parseInt(readlineSync.question('Enter the number of flags:'));
const flags = [];
for (let i = 0; i < N; i++) {
    const coordinates = readlineSync.question(`Enter coordinates for flag ${i + 1} (x y):`).split(" ").map(Number);
    flags.push(coordinates);
}

// Output
const result = minOperations(N, flags);
console.log(result);
