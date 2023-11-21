/**
 * Checks if the stored token is valid and redirects users to the login page if not
 * @returns The token if it is valid
 */
export default function getToken () {
  const token = localStorage.getItem('token')

  if (!token) {
    return null
  }
  return token
}