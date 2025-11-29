/*CHANGES FROM THE TERMINAL BASED PROTOTYPE TO WEB APP
  Functions for section navigation, displaying stores table, updating store and product dropdowns
  Event listeners for buttons to navigate sections and perform actions
  Alerts for user notifications
  Added simple validation for user inputs where applicable

  The LOGIC FUNCTION remains unchanged from the terminal-based prototype
*/

        const ITEMS = {

            cans:          { id: 0, priority: 1, prio_weight: 0.15, BDD: 1 },
            noodles:       { id: 1, priority: 1, prio_weight: 0.15, BDD: 1 },
            snacks:        { id: 2, priority: 1, prio_weight: 0.15, BDD: 1 },
            water:         { id: 3, priority: 1, prio_weight: 0.15, BDD: 0.15 },

            batteries:     { id: 5, priority: 2, prio_weight: 0.10, BDD: 0.25 },
            flashlights:   { id: 6, priority: 2, prio_weight: 0.10, BDD: 0.20 },
            lighters:      { id: 7, priority: 2, prio_weight: 0.10, BDD: 0.10 },
            candles:       { id: 8, priority: 2, prio_weight: 0.10, BDD: 0.10 },

            cigs:          { id: 10, priority: 3, prio_weight: 0.08, BDD: 0.15 },
            dralcohol:     { id: 11, priority: 3, prio_weight: 0.08, BDD: 0.15 },

            rubalcohol:    { id: 15, priority: 4, prio_weight: 0.05, BDD: 0.20 },
            soap:          { id: 16, priority: 4, prio_weight: 0.05, BDD: 0.20 },
            shampoo:       { id: 17, priority: 4, prio_weight: 0.05, BDD: 0.20 },
            tissues:       { id: 18, priority: 4, prio_weight: 0.05, BDD: 0.10 },

            plastics:      { id: 20, priority: 4, prio_weight: 0.05, BDD: 0.25 },
            ropes:         { id: 21, priority: 4, prio_weight: 0.05, BDD: 0.15 },
            tape:          { id: 22, priority: 4, prio_weight: 0.05, BDD: 0.15 }
        };

        class Store {
            constructor(name, customer_count, inc_items) {
                this.name = name;
                this.customer_count = customer_count;
                this.included_items = [...new Set(inc_items)];
                this.stock_suggestions = [];
            }
        }

        class Store_list {
            constructor() {
                this.list = [];
            }

            add_store(store) {
                this.list.push(store);
            }
        }

        const stores = new Store_list();
        let currentStoreIndex = null;

        console.log("Project loaded successfully.");

        function make_store(store_name, store_customers, store_items) {
            stores.add_store(new Store(store_name, store_customers, store_items));
        }

        function create_stock(index, impact, probability, duration) {
            let risk_score = impact * probability;
            let temp_arr = [];

            stores.list[index].included_items.forEach((id, arr_idx) => {
                temp_arr[arr_idx] = calculate_stock(index, id, risk_score, duration);
            });

            stores.list[index].stock_suggestions = temp_arr;
        }

        function calculate_stock(index, curr_id, risk_score, duration) {
            let info_name, info_prio, info_suggestion;
            for (const key in ITEMS) {
                if (ITEMS[key].id === curr_id) {
                    info_name = key;
                    info_prio = ITEMS[key].priority;

                    let demand = ITEMS[info_name].BDD;
                    let population = stores.list[index].customer_count;
                    let prio_weight = ITEMS[info_name].prio_weight;
                    let risk_perc = Math.floor(27 + ((risk_score / 25) * 23));
                    risk_perc = risk_perc / 100;

                    info_suggestion = ((demand * population) + (risk_perc * prio_weight * (demand * population))) * duration;
                    info_suggestion = Number(Math.ceil(info_suggestion));
                    
                    return {
                        name: info_name,
                        id: curr_id,
                        priority: info_prio,
                        stock_suggested: info_suggestion,
                        stock_progress: 0,
                        completion: false
                    };
                }
            }
        }

        function update_stock(stock_list, index, add) {
            stock_list[index].stock_progress += add;

            if (stock_list[index].stock_progress >= stock_list[index].stock_suggested) {
                stock_list[index].completion = true;
                let temp = stock_list[index];
                stock_list.splice(index, 1);
                stock_list.push(temp);
            }
        }

        function showSection(sectionId) {
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');
        }

        function displayStoresTable() {
            let html = '<table>';
            html += '<thead><tr>';
            html += '<th>Store #</th><th>Name</th><th>Daily Customers</th><th>Items Sold</th>';
            html += '</tr></thead><tbody>';

            stores.list.forEach((store, index) => {
                const itemNames = store.included_items.map(id => {
                    for (const key in ITEMS) {
                        if (ITEMS[key].id === id) return key;
                    }
                    return id;
                });
                const itemsDisplay = itemNames.join(", ");
                
                html += `<tr>`;
                html += `<td>${index + 1}</td>`;
                html += `<td>${store.name}</td>`;
                html += `<td>${store.customer_count}</td>`;
                html += `<td>${itemsDisplay}</td>`;
                html += '</tr>';
            });

            html += '</tbody></table>';
            document.getElementById('storesList').innerHTML = html;
        }

        function updateStoreDropdown() {
            const selectStore = document.getElementById('selectStore');
            const selectStoreUpdate = document.getElementById('selectStoreUpdate');
            
            selectStore.innerHTML = '<option value="">-- Select a store --</option>';
            selectStoreUpdate.innerHTML = '<option value="">-- Select a store --</option>';
            
            if (stores.list.length === 0) return;
        
            stores.list.forEach((store, index) => {
                const option1 = document.createElement('option');
                option1.value = index;
                option1.textContent = store.name;
                selectStore.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = index;
                option2.textContent = store.name;
                selectStoreUpdate.appendChild(option2);
            });
        }

        function displaySuggestion(store_index) {
            if (!stores.list[store_index].stock_suggestions || stores.list[store_index].stock_suggestions.length === 0) {
                document.getElementById('suggestionList').innerHTML = "<p>No stock suggestions yet. Please generate suggestions first.</p>";
                return;
            }

            let html = '<table>';
            html += `<thead><tr><th colspan="4">Stock Suggestions for ${stores.list[store_index].name}</th></tr>`;
            html += '<tr><th>Product</th><th>Priority</th><th>Current Stock</th><th>Stock Suggested</th></tr></thead><tbody>';

            stores.list[store_index].stock_suggestions.forEach((product) => {
                html += `<tr>`;
                html += `<td>${product.name}</td>`;
                html += `<td>${product.priority}</td>`;
                html += `<td>${product.stock_progress}</td>`;
                html += `<td>${product.stock_suggested}</td>`;
                html += '</tr>';
            });

            html += '</tbody></table>';
            document.getElementById('suggestionList').innerHTML = html;
        }

        function updateProductDropdown(store_index) {
            const selectProduct = document.getElementById('selectProduct');
            selectProduct.innerHTML = '<option value="">-- Select a product --</option>';
            
            if (stores.list[store_index].stock_suggestions.length === 0) {
                selectProduct.innerHTML += '<option disabled>No products available</option>';
                return;
            }

            stores.list[store_index].stock_suggestions.forEach((product, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${product.name} (Suggested: ${product.stock_suggested}, Current: ${product.stock_progress})`;
                selectProduct.appendChild(option);
            });
        }

        document.getElementById("addStoreBtn").addEventListener("click", function() {
            showSection('newStore');
        });

        document.getElementById("viewStoresBtn").addEventListener("click", function() {
            if (stores.list.length === 0) {
                alert("No stores available. Please add a store first.");
                return;  
            }
            displayStoresTable();
            updateStoreDropdown();
            showSection('viewStores');  
        });

        document.getElementById("addStoreConfirmBtn").addEventListener("click", function() {
            let store_name = document.getElementById("store_name").value;
            let store_customers = parseInt(document.getElementById("store_customers").value);
            let store_items = Array.from(document.querySelectorAll('input[name="store_items"]:checked')).map(cb => Number(cb.value));

            if (store_name === "" || isNaN(store_customers) || store_customers <= 0 || store_items.length === 0) {
                alert("Please fill in all fields correctly.");
                return;
            }

            make_store(store_name, store_customers, store_items);
            alert("Store added successfully!");

            document.getElementById("store_name").value = "";
            document.getElementById("store_customers").value = "";
            document.querySelectorAll('input[name="store_items"]').forEach(cb => cb.checked = false);

            updateStoreDropdown();
            showSection('mainMenu');
        });

        document.getElementById("create-suggestion").addEventListener("click", function() {
            const store_index = document.getElementById("selectStore").value;
            if (store_index === "") {
                alert("Please select a store first.");
                return;
            }
            currentStoreIndex = parseInt(store_index);
            document.getElementById('suggestionList').innerHTML = "";
            showSection('createSuggestion');
        });

        document.getElementById("view-current-suggestion").addEventListener("click", function() {
            const storeIndex = document.getElementById("selectStore").value;
            if (storeIndex === "") {
                alert("Please select a store first.");
                return;
            }
            const index = parseInt(storeIndex);
            
            if (!stores.list[index].stock_suggestions || stores.list[index].stock_suggestions.length === 0) {
                alert("No stock suggestions found for this store. Please generate suggestions first.");
                return;
            }
            
            currentStoreIndex = index;
            displaySuggestion(index);
            showSection('createSuggestion');
        });

        document.getElementById("generateSuggestion").addEventListener("click", function() {
            let store_index = currentStoreIndex !== null ? currentStoreIndex : parseInt(document.getElementById("selectStore").value);
            let impact = parseInt(document.getElementById("impactLevel").value);
            let probability = parseInt(document.getElementById("impactProbability").value);
            let duration = parseInt(document.getElementById("disasterDuration").value);
            
            if (store_index === "" || isNaN(duration) || duration <= 0) {
                alert("Please fill in all fields correctly.");
                return;
            }

            create_stock(parseInt(store_index), impact, probability, duration);
            alert("Stock suggestion successfully created!");
            displaySuggestion(parseInt(store_index));
        });

        document.getElementById("stockUpdate").addEventListener("click", function() {
            if (currentStoreIndex === null) {
                alert("Please select a store first.");
                return;
            }
            document.getElementById("selectStoreUpdate").value = currentStoreIndex;
            updateProductDropdown(currentStoreIndex);
            showSection('updateStockSection');
        });

        document.getElementById("selectStoreUpdate").addEventListener("change", function() {
            const store_index = this.value;
            if (store_index !== "") {
                updateProductDropdown(parseInt(store_index));
            }
        });

        document.getElementById("confirmStockUpdate").addEventListener("click", function() {
            const storeIndex = document.getElementById("selectStoreUpdate").value;
            const productIndex = parseInt(document.getElementById("selectProduct").value);
            const stockToAdd = parseInt(document.getElementById("newStockValue").value);
            
            if (storeIndex === "" || isNaN(productIndex) || isNaN(stockToAdd) || stockToAdd <= 0) {
                alert("Please fill in all fields correctly.");
                return;
            }
            
            update_stock(stores.list[parseInt(storeIndex)].stock_suggestions, productIndex, stockToAdd);
            alert("Stock updated successfully!"); 
            
            document.getElementById("newStockValue").value = "";
            displaySuggestion(parseInt(storeIndex));
            showSection('createSuggestion');
        });

        //For all back buttons
        document.querySelectorAll('.back-Btn').forEach(button => {
            button.addEventListener("click", function() {
                showSection('mainMenu');
            });
        });