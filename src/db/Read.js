const Firestore = require('./Firestore')
const algoliasearch = require('algoliasearch/lite')

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

const ReadItems = async (page, ppp) => {
  try {
    const products = await Firestore.db.collection('products').orderBy('name')
    const snapshot = await products
      .limit(ppp)
      .offset(page * ppp)
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

const ReadItemsAlgolia = async (indexName, query, page, ppp) => {
  try {
    const client = algoliasearch(
      process.env.ALGOLIA_APP_ID,
      process.env.ALGOLIA_SEARCH_API_KEY
    )
    const index = client.initIndex(indexName)
    const { hits } = await index.search(query, {
      attributesToRetrieve: ['name', 'size', 'price', 'image', 'addToCartLink'],
      hitsPerPage: ppp,
      page: page,
    })
    return hits
  } catch (e) {
    throw Error(e)
  }
}

module.exports = { ReadItem, ReadItems, ReadItemsAlgolia }
