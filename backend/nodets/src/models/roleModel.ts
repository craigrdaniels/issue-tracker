import { Schema, model, type Document } from 'mongoose'

export interface IRole extends Document {
  title: string
}

const roleSchema = new Schema<IRole>({
  title: String
})

export default model<IRole>('Role', roleSchema, 'roles')
