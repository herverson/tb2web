import { http } from "./config"

export default {
  listar: () => {
    return http.get('books')
  },
  listarCaps: (id) => {
    return http.get(`books/${id}/chapters`)
  },

  salvar:(book) => {
    return http.post('books', book)
  },

  editar:(book) => {
    return http.put(`books/${book._id}`, book)
  },

  excluir:(book) => {
    return http.delete(`books/${book._id}`, {data: book })
  },

  salvarCapitulo: (book, capitulo) => {
    return http.post(`books/${book._id}/chapters`, capitulo)
  },


}