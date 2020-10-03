const Firestore = require('./Firestore')

const ReadItem = async id => {
  try {
    const item = await Firestore.db
      .collection('products')
      .doc(`product-${id}`)
      .get()
    if (!item.exists) {
      console.log('No such document!')
    } else {
      return item.data()
    }
  } catch (e) {
    throw Error(e)
  }
}

const ReadItems = async page => {
  try {
    const products = await Firestore.db
      .collection('products')
      .orderBy('name')
      .startAt(page * 24)
      .limit(24)
    const snapshot = await products
      .get()
    if (snapshot.empty) {
      console.log('No matching documents.')
      return
    }
    return snapshot
  } catch (e) {
    throw Error(e)
  }
}

module.exports = { ReadItem, ReadItems }
