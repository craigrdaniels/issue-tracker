class HTTPRequestError extends Error {
  constructor(public status: number, public message: string) {
    super()
  }
}

export default HTTPRequestError
