// utility function to handle error messages
export const getError = (error) =>{
  return (
    error.response && error.response.data.message
    ? error.response.data.message // specific message from backend
    : error.message // generic message
  )
}
