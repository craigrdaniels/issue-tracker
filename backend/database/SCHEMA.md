# Database

## Schema Design

### Users table

| Columns |  Type  |
|---------|--------|
| _id | ObjectId |
| username | varchar |
| email | varchar |
| password | varchar |
| role | foreign_key |
| profile pic | String |
| projects | [foreign_key] |


### Roles table

| columns | Type |
|---------|------|
| _id | ObjectId |
| name | varchar |


### Issues table

| Columns | Type |
|---------|------|
| _id | ObjectId |
| title | String |
| created_at | timestamp |
| created_by | foreign_key |
| project | foreign_key |
| asigned_users | [foreign_key] |
| is_open | boolean |
| severity | String |


### Messages table

| Columns | Type |
|---------|------|
| _id | ObjectId |
| created_by | foreign_key |
| issue | foreign_key |
| created_at |  timestamp |
| last_edit | timestamp |
| content | String |
| attachments | [String] |



### Actions table

| Columns | Type |
|---------|------|
| _id | ObjectId |
| issue | foreign_key |
| user | foreign_key |
| action | String |

### Projects table

| Columns | Type |
|---------|------|
| _id | ObjectId |
| name | String |
| project_lead | foreign_key |

 

### Actions:
 - id
 - create issue, add tag, remove tag, user assigned, user removed, mark closed



## Notes

how do we do the timeline? is it a linked list, timestamps - show actions history / when user added to project, tags updated, messages added etc?
how to provide notifications on actions, etc?

