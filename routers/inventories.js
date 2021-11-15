const database = require('../database/database');
const router = require('express').Router();

router.get('/', (req, res, next) => {
  // return database.queryPromise(`SELECT * FROM HW2_inventories ORDER BY id;`, [], function (error, result) {
  //   if (error) {
  //     return next(error);
  //   }

  //   const itemsArray = [];
  //   for (let i = 0; i < result.rows.length; i++) {
  //     const item = result.rows[i];
  //     itemsArray.push({
  //       id: item.id,
  //       itemName: item.itemname,
  //       itemQuantity: item.itemquantity,
  //     });
  //   }
  //   return res.json({ inventoryItems: itemsArray });
  // });
  return database.queryPromise(`SELECT * FROM HW2_inventories ORDER BY id;`)
    .then(result => {
      const itemsArray = [];
      for (let i = 0; i < result.rows.length; i++) {
        const item = result.rows[i];
        itemsArray.push({
          id: item.id,
          itemName: item.itemname,
          itemQuantity: item.itemquantity,
        });
      }
      return res.json({ inventoryItems: itemsArray });
    })
    .catch(error => {
      console.log(error);
      return next(error);
    })
})

router.put('/', (req, res, next) => {
  let itemID = req.body.itemID;
  let ItemName = req.body.itemName;
  let ItemQuantity = req.body.itemQuantity;
  let query = 'UPDATE HW2_inventories SET itemname = $1, itemquantity = $2 WHERE id = $3';

  // return database.queryPromise(query, [ItemName, ItemQuantity, itemID], (error, result) => {
  //   if (error) {
  //     console.log(error);
  //     return res.status(500).json({
  //       message: error
  //     })
  //   }
  //   if (result.rowCount === 0) {
  //     return next(createHttpError(404, `Item with ID ${itemID} cannot be found`));
  //   }
  //   return res.sendStatus(200);
  // });
  return database.queryPromise(query, [ItemName, ItemQuantity, itemID])
    .then(response => {
      if (response.rowCount === 0) {
        return next(createHttpError(404, `Item with ID ${itemID} cannot be found`));
      }
      return res.sendStatus(200);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({ message: error })
    })
})

router.post('/', (req, res, next) => {
  let itemName = req.body.itemName;
  let itemQuantity = req.body.itemQuantity;

  let queryString = `INSERT INTO hw2_inventories (itemname, itemquantity) VALUES ($1, $2);`;

  // return database.queryPromise(queryString, [itemName, itemQuantity], (error, result) => {
  //   if (error) {
  //     console.log(error);
  //     return res.status(500)
  //   }

  //   res.status(201).json({
  //     data: result
  //   })
  // })

  return database.queryPromise(queryString, [itemName, itemQuantity])
    .then(response => {
      return res.status(201).json({
        data: response
      })
    })
    .catch(error => {
      console.log(error);
      return res.status(500)
    })
})

router.delete('/', (req, res, next) => {
  let itemToDeleteID = req.query.itemID; //why query and not params? Both query and params has itemID value

  let queryString = `DELETE FROM hw2_inventories WHERE id = $1`;

  // return database.queryPromise(queryString, [itemToDeleteID], (error, result) => {
  //   if (error) {
  //     return res.status(500)
  //   }

  //   res.status(200).json({
  //     message: 'delete successful'
  //   })
  // })

  return database.queryPromise(queryString, [itemToDeleteID])
    .then(() => {
      return res.status(200).json({
        message: 'delete successful'
      })
    })
    .catch( error => {
      return res.status(500).json({
        message: error
      })
    })
})

module.exports = router;
