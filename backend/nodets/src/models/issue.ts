import { Schema, model } from 'mongoose'

const issueSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    required: true
  },
  created_by: {
    type: Number,
    required: true
  },
  project: {
    type: Number,
    required: true
  },
  assigned_users: {
    type: Array,
    required: false
  },
  is_open: {
    type: Boolean,
    required: true
  },
  severity: {
    type: Number,
    required: false
  }
})

export default model('Issue', issueSchema, 'issues')
