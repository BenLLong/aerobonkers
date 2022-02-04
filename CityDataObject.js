import { TableObject } from 'randomtools-js';

class CityDataObject extends TableObject {
/*
* A TableObject defines a class where tabular data in a ROM is loaded into
* rows, assigned attributes based on the structure of the table, and is randomized.
*
* Each class where shouldRandomize returns true will proceed through the 
* steps of randomization in the following order:
*     Intershuffle (intershuffleAttributes)
*     Randomize (randomizeAttributes)
*     Mutate (mutateAttributes)
* 
* It is unlikely any one class will use all steps of randomization.
* All of them are used here for explanatory purposes. Any given attribute
* may appear in none, one, or multiple of each of the steps.
* 
* Finally, all classes will Cleanup regardless of shouldRandomize value.
* 
* All of these steps have static methods and individual methods that can be
* overwritten for more direct control of the randomization process, but the 
* default settings allow for quick development of data-driven table randomization.
*/

    static shouldRandomize() {
        return this.context.specs.flags.c;
    }
    
    // By default, the row's index is used for rank, which is used to determine which
    // rows are similar to each other. You can override this behavior, as shown here.
    get rank() {
        return this.oldData.population;
    }
    
    cleanup() {
        // Ensure city country has not changed
        console.assert(this.data.country === this.oldData.country); 
    }
}

// For intershuffleAttributes, the class is taken as a whole, and values are shuffled
// between "nearby" rows. "Nearby" is determined by rank. Attributes nested within an
// array will remain together when intershuffled.
// CityDataObject.intershuffleAttributes = [
//     "population", ["tourism", "economy"],
// ];

// For randomizeAttributes, each row takes a random value from among all rows' old values.
// No concept of nearby, rank, or normal distribution is used; this is strictly random.
CityDataObject.randomizeAttributes = [
    "population", "tourism", "economy"
];
    
// For mutateAttributes, each row's values are changed directly by one of several methods. 
// CityDataObject.mutateAttributes = {
//     // For null, the range of valid values is determined from all of the rows of the table, 
//     // and the value is mutated within those bounds. This is the most common 
//     // mutateAttribute value and will do the right thing the majority of the time.
//     "population": null, 
//     "tourism": null,
//     "economy": null,

//     // An array of two integers will define bounds the value will be mutated between.
//     // "tourism": [1, 63],
//     // "economy": [1, 63],

//     // An example type not used in this randomizer:
//     // "drop_item_index": ItemObject,
//     // Setting another TableObect-inheriting class as the value indicates this is an index into
//     // that class, and the logic of that class's rank will be used to determine what a similar
//     // value to be mutated into is.

//     // In all instances except closure, the mutation is done via a normal distribution.
// };

CityDataObject.tableSpecs = {
    text: [  // The attribute structure of the tabular data to be randomized.
        "country,1",
        "population,1", // is decimated when displayed; i.e. 5.6m for London scenario 1 is 56
        "tourism,1",
        "economy,1",
        // These values can be loaded from external text files using array-loader instead of written here.
        // First value will be the attribute name in .data and .oldData, second value is byte length.
        // If second value is "bit", it is a single byte that is a bitfield as seen above.
        // Some features are not shown here:
        //   1. A list, for example, "color,32x2,list".
        //   2. A fixed-length ASCII string, for example, "attackname,10,str".
        //   3. Using "?" as the length for complexly-stored data that must have getters and setters custom-written.
    ],
    
    count: 178, // The number of rows of tabular data present; 89 cities * 2 scenarios = 178 rows
    pointer: 0x77130, // The byte offset of the beginning of the table (PC-addressing, not SNES-addressing)
    // Scenario 3 and 4 city stats seem to be calculated based on scenarios 1 and 2 combined with some X factor
};

CityDataObject._displayName = "city data";
export default CityDataObject;