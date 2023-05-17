export const location = import.meta.env.SERVER
  ? process.env.SERVER?.split(':')[0]
  : window.location.hostname

export const port = import.meta.env.SERVER?.split(':')[1]
  ? process.env.SERVER?.split(':')
  : '3000'
