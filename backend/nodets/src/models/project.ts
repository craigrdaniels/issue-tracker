import { Schema, model } from 'mongoose'

const projectSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  project_lead: { type: Schema.Types.ObjectId, refPath: 'User' }
})

export default model('Project', projectSchema, 'projects')
