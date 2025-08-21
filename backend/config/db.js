import mongoose from 'mongoose'

export default async function connectDB(uri){
  try{
    await mongoose.connect(uri, { dbName: 'global_connect' })
    console.log('MongoDB connected')
  }catch(err){
    console.error('MongoDB error', err.message)
    process.exit(1)
  }
}