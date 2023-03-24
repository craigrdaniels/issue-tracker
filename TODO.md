## Todo



# Database

## Schema Design

### Users table

| Columns |  Type  |
|---------|--------|
| id | integer |
| username | varchar |
| email | varchar |
| password | varchar |
| roles | [foreign_key] |
| profile pic |  |
| projects | [foreign_key] |


### Roles table

| columns | Type |
|---------|------|
| id | integer |
| name | varchar |


### Issues table

| Columns | Type |
|---------|------|
| id | integer |
| created_at | timestamp |
| created_by | foreign_key |
| project / department | foreign_key |
| asigned_users | [foreign_key] |
| is_open | boolean |
| severity | integer |


### Messages table

| Columns | Type |
|---------|------|
| id | integer |
| created_by | foreign_key |
| issue_id | foreign_key |
| created_at |  timestamp |
| last_edit | timestamp |
| content | varchar |
| attachments | |



### Actions table

| Columns | Type |
|---------|------|
| id | integer |
| issue_id | foreign_key |
| user_id | foreign_key |
| action | |

 

### Actions:
 - id
 - create issue, add tag, remove tag, user assigned, user removed, mark closed



## Notes

how do we do the timeline? is it a linked list, timestamps - show actions history / when user added to project, tags updated, messages added etc?
how to provide notifications on actions, etc?




example issue

* Contact Page Shows Incorrect Phone Number -open *severity-moderate* #tag1 #tag2
- Submitted by: User1
- Message: The number should be 123456 not 12456
- Attachments

  |
  | - User1 added the x label
  |
  | - User3 is assigned to this issue
  | 
  |
- User3 wrote:
  - message



ISSUE -> message -> action -> 



node.js set up done with 
https://www.youtube.com/watch?v=H91aqUHn8sE

