import { Schema, model } from 'mongoose'

const roleSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: String
})

export default model('Role', roleSchema, 'roles')
