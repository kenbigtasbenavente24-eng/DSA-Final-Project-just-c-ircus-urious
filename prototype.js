/*
/ This is a working terminal-based application highlighting
/ the fundamentals of the application, made to display how
/ the MVP is supposed to work.
/
/ UPDATES:
/ 11/19/25 - Half the prototype is done, will make the other half tomorrow, I hope that's ok
/ 11/23/25 - The prototype is complete with a few caveats:
/            + It has (or almost has) ZERO ERROR HANDLING, the user is expected to be illiterate
/            + Some of the implemented features, like the formula and ESPECIALLY the formula is
/              subject to change along development
/            + And lastly, some of the features could use expanding
/
/              HOWEVER, I believe that the prototype is full enough for us to move onto
/              integrating html + css to the project. I apologize it took this long, but I'm
/              confident we'll complete this in time, if not days earlier than the deadline :>
*/

// list of items and their individual details
// each item's id starts in counts of 5 per priority level and category
const ITEMS =
{
  // food items (id starts at 0)
  cans:          { id: 0, priority: 1, prio_weight: 0.15, BDD: .10 },
  noodles:       { id: 1, priority: 1, prio_weight: 0.15, BDD: .12 },
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
    this.stock_suggestions = [];
  }
}

class Store_list
{
  constructor() {
    this.list = [];
  }

  add_store(store) {
    this.list.push(store);
  }
}

// terminal-based elements 
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

function main() 
{
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

function display_make() 
{
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

// LOGIC FUNCTION
const stores = new Store_list();
function make_store(store_name, store_customers, store_items) 
{
  stores.add_store(new Store(store_name, store_customers, store_items))
}

function display_stores() 
{
  console.log("\n=== EXISTING STORES ===\n");

  if (stores.list.length === 0) {
    console.log("No stores have been added yet.\n");
    return;
  }

  stores.list.forEach((store, index) => {
    console.log(`Store [${index + 1}]`);
    console.log(`  Name: ${store.name}`);
    console.log(`  Daily Customers: ${store.customer_count}`);
    console.log(`  Items Sold [id]: ${store.included_items.join(", ")}`);
    console.log("---------------------------");
  });

  rl.question("Which store would you like to access? ", input => {
    console.log(`\nAccessing ${stores.list[input - 1].name} ...`);
    console.log("What would you like to do?");
    console.log("[1] Get new stock suggestions");
    console.log("[2] View current stock suggestions");
    rl.question("Enter: ", choice => {
      switch (choice) {
        case "1":
          display_create(input - 1);
          break;
        case "2":
          display_view(input - 1);
          break;
      }
    });
  });
}

function display_create(index)
{
  console.clear();
  rl.question("\nIn a scale of 1 to 5, how much do you expect the impending typhoon to affect your area? ", impact => {
    rl.question("In a scale of 1 to 5, how likely do you think would that amount of impact happen? ", probability => {
      rl.question("(In days) how long do you think the effects of the disaster last? ", duration => {
        create_stock(index, impact, probability, duration);
      });
    });
  });
}

// LOGIC FUNCTION
function create_stock(index, impact, probability, duration) 
{
  let risk_score = impact * probability;
  let temp_arr = [];

  stores.list[index].included_items.forEach((id, arr_idx) => {
    temp_arr[arr_idx] = calculate_stock(index, id, risk_score, duration);
  });

  stores.list[index].stock_suggestions = temp_arr;
  main();
}

// LOGIC FUNCTION
function calculate_stock(index, curr_id, risk_score, duration)
{
  let info_name, info_prio, info_suggestion;
  for (const key in ITEMS) {
    if (ITEMS[key].id === curr_id) {
      info_name = key;
      info_prio = ITEMS[key].priority;

      let demand = ITEMS[info_name].BDD;
      let population = stores.list[index].customer_count;
      let prio_weight = ITEMS[info_name].prio_weight;
      let risk_perc = Math.floor( 27 + ( (risk_score / 25) * 23 ) )
      risk_perc = risk_perc / 100; // get decimal/percent version

      info_suggestion = ((demand * population) + (risk_perc * prio_weight * (demand * population)))
                        * duration;
      info_suggestion = Number(Math.ceil(info_suggestion));
      
      return {
        name:             info_name,
        id:               curr_id,
        priority:         info_prio,
        stock_suggested:  info_suggestion,
        stock_progress:   0,
        completion:       false
      };
    }
  }
}

function display_view(index)
{
  console.clear();
  if (!stores.list[index].stock_suggestions) {
    console.log("The store currently has no stock suggestions!");
    main();
  }
  else {
    console.log(`\n=== STOCK SUGGESTIONS FOR ${stores.list[index].name} ===\n`);
    console.log("Product \t\tCurrent Stock\tStock Suggested");
    console.log("---------------------------------------------------------");

    stores.list[index].stock_suggestions.forEach((product, idx) => {
      let tabs = product.name.length < 8 ? "\t\t" : "\t";
      console.log("[" + (idx + 1) + "] " + product.name + tabs +
                  product.stock_progress + "\t\t " + product.stock_suggested);
    });

    console.log("\nChoose an option:");
    console.log("[1] Update a product's stock");
    console.log("[0] Exit to Main Menu");
    rl.question("Enter: ", choice => {
      switch (choice) {
        case "1":
          rl.question("Enter a product's [list #] to update: ", prod => {
            console.log("Adding stock to " + stores.list[index].stock_suggestions[prod - 1].name + " ...");
            rl.question("How much would you like to add? ", add => {
              update_stock(stores.list[index].stock_suggestions, prod - 1, Number(add));
              console.clear();
              console.log("Successfully added " + add + " stock to " + stores.list[index].name);
              display_view(index);
            });
          });
          break;
        default:
          main();
          break;
      }
    });
  }
}

// LOGIC FUNCTION
function update_stock(stock_list, index, add)
{
  stock_list[index].stock_progress += add;

  // If stock is completed, AKA progress exceeds suggestion
  if (stock_list[index].stock_progress >= stock_list[index].stock_suggested) {
    stock_list[index].completion = true;
    let temp = stock_list[index];
    stock_list.splice(index, 1);
    stock_list.push(temp);
  }
}

main();