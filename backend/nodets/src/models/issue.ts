import { Schema, model } from 'mongoose'

const issueSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: String,
  created_at: Date,
  created_by: { type: Schema.Types.ObjectId, refPath: 'User' },
  project: { type: Number, refPath: 'Project' },
  assigned_users: { type: [Schema.Types.ObjectId], refPath: 'User' },
  is_open: Boolean,
  tags: { type: [String] },
  severity: { type: String, enum: ['Low', 'Medium', 'High'] }
})

export default model('Issue', issueSchema, 'issues')
