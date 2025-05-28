const MODE = import.meta.env.MODE
const protocol = MODE === 'production' ? 'https' : 'http'
export const apiBaseUrl = `${protocol}://localhost:5000/api/v1`


const mongoGuiUsername = import.meta.env.VITE_MONGOWEB_ADMIN_USERNAME
const mongoGuiPassword = import.meta.env.VITE_MONGOWEB_ADMIN_PASSWORD
export const mongoGuiUrl = `${protocol}://${mongoGuiUsername}:${mongoGuiPassword}@localhost:8081`