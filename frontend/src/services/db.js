import { openDB } from 'idb'

const DB_NAME = 'arboretum_db'
const STORE_NAME = 'predictions'

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        })
        store.createIndex('timestamp', 'timestamp')
        store.createIndex('type', 'type')
      }
    },
  })
}

export const savePrediction = async (prediction) => {
  const db = await initDB()
  return db.add(STORE_NAME, {
    ...prediction,
    timestamp: new Date().toISOString(),
  })
}

export const getAllPredictions = async () => {
  const db = await initDB()
  return db.getAll(STORE_NAME)
}

export const getPredictionsByType = async (type) => {
  const db = await initDB()
  return db.getAllFromIndex(STORE_NAME, 'type', type)
}