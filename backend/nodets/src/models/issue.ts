import { Schema, model } from 'mongoose'

const issueSchema = new Schema({
  title: {
    type: String,
    required: true
  }
})

export default model('Issue', issueSchema, 'issues')
