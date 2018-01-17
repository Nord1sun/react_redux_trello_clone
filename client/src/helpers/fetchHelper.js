// Fetch helper method
export function checkStatus(response) {
  if (!response.ok) {
    const error = new Error(response.message);
    error.response = response;
    return response.json(error);
  }

  return response.json();
}
