import { Schema, model, type Document } from 'mongoose'
import { type IUser } from './userModel.js'

export interface IProject extends Document {
  name: string
  project_lead: IUser['_id']
}

const projectSchema = new Schema({
  name: String,
  project_lead: { type: Schema.Types.ObjectId, refPath: 'User' }
})

export default model<IProject>('Project', projectSchema, 'projects')
