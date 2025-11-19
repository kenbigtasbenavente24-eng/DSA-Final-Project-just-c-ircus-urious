/*
/ This is a working terminal-based application highlighting
/ the fundamentals of the application, made to display how
/ the MVP is supposed to work.
/
/ UPDATES:
/ 11/19/25 - Half the prototype is done, will make the other half tomorrow, I hope that's ok
*/

// list of items and their individual details
// each item's id starts in counts of 5 per priority level and category
const ITEMS =
{
  // food items (id starts at 0)
  cans:          { id: 0, priority: 1, prio_weight: 0.15, BDD: 1 },
  noodles:       { id: 1, priority: 1, prio_weight: 0.15, BDD: 1 },
  snacks:        { id: 2, priority: 1, prio_weight: 0.15, BDD: 1 },
  water:         { id: 3, priority: 1, prio_weight: 0.15, BDD: 0.15 },

  // energy/light items (id starts at 5)
  batteries:     { id: 5, priority: 2, prio_weight: 0.10, BDD: 0.25 },
  flashlights:   { id: 6, priority: 2, prio_weight: 0.10, BDD: 0.20 },
  lighters:      { id: 7, priority: 2, prio_weight: 0.10, BDD: 0.10 },
  candles:       { id: 8, priority: 2, prio_weight: 0.10, BDD: 0.10 },

  // comfort items (id starts at 10)
  cigs:          { id: 10, priority: 3, prio_weight: 0.08, BDD: 0.15 },
  dralcohol:     { id: 11, priority: 3, prio_weight: 0.08, BDD: 0.15 },

  // hygiene items (id starts at 15)
  rubalcohol:    { id: 15, priority: 4, prio_weight: 0.05, BDD: 0.20 },
  soap:          { id: 16, priority: 4, prio_weight: 0.05, BDD: 0.20 },
  shampoo:       { id: 17, priority: 4, prio_weight: 0.05, BDD: 0.20 },
  tissues:       { id: 18, priority: 4, prio_weight: 0.05, BDD: 0.10 },

  // Preparation/Repair items (id starts at 20)
  plastics:      { id: 20, priority: 4, prio_weight: 0.05, BDD: 0.25 },
  ropes:         { id: 21, priority: 4, prio_weight: 0.05, BDD: 0.15 },
  tape:          { id: 22, priority: 4, prio_weight: 0.05, BDD: 0.15 }
};

class Store
{
  constructor(name, customer_count, inc_items) {
    this.name = name;
    this.customer_count = customer_count;
    this.included_items = [...new Set(inc_items)];
    this.stock_suggestions = {};
  }
}

class Store_list
{
  constructor() {
    this.stores = [];
  }

  add_store(store) {
    this.stores.push(store);
  }
}

// terminal-based elements 
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

function main() {

  console.log("Welcome to the prototype for the stock suggestions app\n");
  console.log("Please Choose an option:");
  console.log("[1] Add new store");
  console.log("[2] View existing stores");
  console.log("[0] Exit");

  rl.question("", function(choice) {
    console.clear();

    switch (choice) {
      case "1":
        console.log("Chose 1");
        display_make();
        break;

      case "2":
        console.log("Chose 2");
        display_stores();
        main();
        break;

      case "0":
        console.log("Exiting the app...");
        rl.close();
        break;

      default:
        console.log("Invalid input!");
        main();
    }
  });
}

function display_make() {
  let store_name;
  let store_customers;
  let store_items = [];

  rl.question("Enter store name: ", function(n) {
    store_name = n;

    rl.question("Enter average daily transactions (no. of customers): ", function(c) {
      store_customers = Number(c);

      console.log("Which of the following products do you sell in your store?\n");

      console.log("[0] Assorted canned goods");
      console.log("[1] Assorted instant noodles");
      console.log("[2] Assorted biscuits & snacks");
      console.log("[3] Water bottles\n");

      console.log("[5] Batteries");
      console.log("[6] Flashlights");
      console.log("[7] Lighters");
      console.log("[8] Candles\n");

      console.log("[10] Cigarettes");
      console.log("[11] Drinking Alcohol\n");

      console.log("[15] Rubbing Alcohol");
      console.log("[16] Soap");
      console.log("[17] Shampoo");
      console.log("[18] Tissues\n");

      console.log("[20] Assorted Plastics");
      console.log("[21] Ropes");
      console.log("[22] Packaging Tape\n");

      rl.question("(Example: 0 1 2 3 5...) Enter products: ", input => {
        store_items = input.split(" ").map(Number);
        make_store(store_name, store_customers, store_items);

        console.log("\nStore added successfully!\n");
        
        main();
      });
    });
  });
}

const stores = new Store_list();
function make_store(store_name, store_customers, store_items) {
  stores.add_store(new Store(store_name, store_customers, store_items))
  main();
}

function display_stores() {
  console.log("\n=== EXISTING STORES ===\n");

  if (stores.stores.length === 0) {
    console.log("No stores have been added yet.\n");
    return;
  }

  stores.stores.forEach((store, index) => {
    console.log(`Store #${index + 1}`);
    console.log(`  Name: ${store.name}`);
    console.log(`  Daily Customers: ${store.customer_count}`);
    console.log(`  Items Sold [id]: ${store.included_items.join(", ")}`);
    console.log("---------------------------");
  });

  console.log();
}

main();