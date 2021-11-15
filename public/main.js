const axios = window.axios;


function connectToDatabase() {
  //change to axios
  return fetch(`/connect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // body: JSON.stringify({
    //   connectionString,
    // }),
  }).then(function (response) {
    if (response.status === 200) {
      console.log('Successfully connected to database');
      return;
    }
    return response.json().then(function (response) {
      throw new Error(response.error);
    });
  });
}

function getAllItems() {
  return axios.get('/api/inventories')
    .then((response) => {
      return response.data;
    })
    .then((json) => {
      if (json.error) throw new Error(json.error);

      return json.inventoryItems;
    })
}

function addItem(newItemName, quantity) {
  return axios.post('/api/inventories', {
    itemName: newItemName,
    itemQuantity: quantity
  })
    .then((response) => {
      return response.data;
    })
    .then((json) => {
      if (json.error) throw new Error(json.error);
    });
}

function updateInventory(itemID, itemName, itemQuantity) {
  return axios.put('/api/inventories', {
    itemID: itemID,
    itemName: itemName,
    itemQuantity: itemQuantity
  }).then((response) => {
    return response.data;
  }).then((json) => {
    if (json.error) {
      throw new Error(json.error);
    }
    return alert(`Item with ID: ${itemID} successfully updated`)
  }).catch((error) => {
    alert(error);
  })
}

function deleteInventory(itemID) {
  return axios.delete('/api/inventories', {
    params: {
      itemID: itemID
    }
  })
    .then((response) => {
      return response.data;
    })
    .then((json) => {
      if (json.error) {
        throw new Error(json.error);
      }
      alert(`An item has been deleted.`);
      return refreshTable();
    })
    .catch((error) => {
      alert(error.response.data.message);
    })
}

function refreshTable() {
  return getAllItems()
    .then((response) => { //response = itemsArray

      if (response.length === 0) {
        loadingText.innerHTML = 'No content to display.';
        return;
      }

      inventoriesTable.innerHTML = "";
      let tableString = "";
      response.forEach(items => {
        tableString += `<tr><td>${items.id}</td><td>${items.itemName}</td><td>${items.itemQuantity}</td>`;
        tableString += `<td><button onclick="deleteInventory(${items.id})">Delete</button></td></tr>`;
      });

      loadingText.hidden = true;
      updateSection.hidden = false;
      return inventoriesTable.innerHTML += tableString;
    })
}

window.addEventListener('DOMContentLoaded', () => {
  const itemNameInput = document.getElementById('itemName');
  const itemQuantityInput = document.getElementById('itemQuantity');
  const updateItemID = document.getElementById('updateItemID');
  const updateItemName = document.getElementById('updateItemName');
  const updateItemQuantity = document.getElementById('updateItemQuantity');
  const inventoriesTable = document.getElementById('inventoriesTable');
  const loadingText = document.getElementById('loadingText');
  const updateSection = document.getElementById('updateSection');
  const addItemButton = document.getElementById('addItem');
  const updateButton = document.getElementById('updateButton');

  // const connectionString = 'postgres://nygviclj:3U6zp8Twh_V5p9AFiAVWWOncaImQbk5G@fanny.db.elephantsql.com/nygviclj';
  connectToDatabase()
    .then(() => {
      refreshTable();
    })
    .catch((error) => {
      alert(error);
    })

  addItemButton.onclick = () => {
    if (itemNameInput.value.replaceAll(" ", "") === "" || itemQuantityInput.value === "") {
      return alert('Please enter valid values in input boxes.')
    }

    addItem(itemNameInput.value, itemQuantityInput.value)
      .then(() => {
        itemNameInput.value = "";
        itemQuantityInput.value = "";
        refreshTable();
      })
      .catch((error) => {
        return alert(error.message);
      })

  }

  updateButton.onclick = () => {
    let updatedID = updateItemID.value;
    updateInventory(updateItemID.value, updateItemName.value, updateItemQuantity.value)
      .then((response) => {
        // alert(`Item with ID ${updatedID} has been changed`)
        updateItemID.value = "";
        updateItemName.value = "";
        updateItemQuantity.value = "";
        return refreshTable();
      })
      .catch((error) => {
        return alert(error.message);
      })
  }
})