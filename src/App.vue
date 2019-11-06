<template>
    <div>
        <Header />
        <div class="container">
            <b-button @click="templateFormLivro = true, book = {}" variant="success"><i class="material-icons">add_circle</i></b-button>
            <!--template formulario para livros-->
            <template v-if="templateFormLivro">
                <div class="card">
                    <div class="card-body">
                        <form @submit.prevent="salvar">
                            <div class="form-group">
                                <label for="titulo">Título</label>
                                <input type="text" class="form-control" id="titulo" placeholder="Título" v-model="book.titulo">
                            </div>
                            <div class="form-group">
                                <label for="anoPub">Ano de Publicação</label>
                                <input type="number" class="form-control" id="anoPub" placeholder="Ano de Publicação" v-model="book.ano_publicacao">
                            </div>
                            <div class="form-group">
                                <label for="autor">Autor</label>
                                <input type="text" class="form-control" id="autor" placeholder="Autor" v-model="book.autor">
                            </div>
                            <button class="btn btn-primary" type="submit"><i class="material-icons">save</i>
                            </button>
<!--                            <b-alert show dismissible fade v-if="sucesso" variant="success">-->
<!--                                Salvo!-->
<!--                            </b-alert>-->
                        </form>
                    </div>
                </div>
            </template>
            <!--fim template formulario livros-->
            <br>
<!--            template para lista de livros-->
            <template v-if="templateListaLivro">
            <div class="row">
                <div class="col-md-3" v-for="book of books" :key="book._id">
                    <div class="card">
                        <div class="card-header lista-card" @click="listarCap(book)">{{book.titulo}} </div>
                        <div class="card-body">
                            <p class="card-text">Ano de Publicação: {{book.ano_publicacao}}</p>
                            <p class="card-text">Autor: {{book.autor}}</p>
                        </div>
                        <div class="card-footer bg-transparent">
                            <div class="row">
                                <div class="col-md-6">
                                    <b-button @click="editar(book)" variant="warning"><i class="material-icons">create</i></b-button>
                                </div>
                                <div class="col-md-6">
                                    <b-button @click="excluir(book)" variant="danger"><i class="material-icons">delete</i></b-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </template>
<!--            fim template lista de livros-->
            <!--            template livro-->
            <template v-if="templateLivro">
                <div class="card">
                    <h5 class="card-header">{{book.titulo}}</h5>
                    <div class="card-body">
                        <h5 class="card-title">{{book.ano_publicacao}}</h5>
                        <p class="card-text">{{book.autor}}.</p>
                    </div>
                </div>
            </template>
            <!--            fim template livro-->
            <br>
<!--            template para formulario de capitulos-->
            <template v-if="templateFormCapit">
                <div class="card">
                    <div class="card-body">
                        <div class="form-group">
                            <label for="nomeCapitulo">Nome do Capítulo</label>
                            <input type="text" class="form-control" id="nomeCapitulo" placeholder="Capítulo" v-model="capitulo.nome">
                        </div>
                        <div class="form-group">
                            <label for="anoPub">Conteúdo do Capítulo</label>
                            <b-textarea class="form-control" id="anoPub" placeholder="Conteúdo" rows="10" v-model="capitulo.conteudo"></b-textarea>
                        </div>
                        <b-button variant="primary" @click="salvaCapitulo">
                            Salvar!
                        </b-button>
                    </div>
                </div>
            </template>
<!--            fim template para formulario de capitulos-->

<!--            template lista de capitulos-->
            <template v-if="templateListaCapit">
                <div role="tablist">
                    <b-button @click="addCap(book)" variant="success"><i class="material-icons">add_circle</i></b-button>
                    <b-card no-body class="mb-1" v-for="(chapter,index) in capitulos" :key="index">
                        <b-card-header header-tag="header" class="p-1" role="tab">
                            <button type="button" class="btn btn-info btn-block" v-b-toggle:aria-controls="chapter._id" @click="conteudoCap(chapter)">{{chapter.nome}}</button>

    <!--                        <b-button block v-b-toggle.acc @click="conteudoCap(capitulo)" variant="info">{{capitulo.nome}}</b-button>-->
                        </b-card-header>
                        <b-collapse :id="chapter._id" accordion="my-accordion" role="tabpanel">
                            <b-card-body>
    <!--                            <b-card-text>{{index}}</b-card-text>-->
                                <b-card-text>{{capitulo.conteudo}}</b-card-text>
                                <b-button @click="editarCap()" variant="warning"><i class="material-icons">create</i></b-button>

                                <b-button @click="excluirCap" variant="danger"><i class="material-icons">delete</i></b-button>
                            </b-card-body>
                        </b-collapse>
                    </b-card>
                </div>
            </template>
<!--            fim template para lista de capitulos-->

        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Header from './components/Header'
    export default {
        components: {
            Header
        },
        data() {
            return {
                book: {
                    _id: '',
                    titulo: '',
                    ano_publicacao: '',
                    autor: '',
                },
                books: [],
                capitulo: {
                    _id: '',
                    nome: '',
                    conteudo: ''
                },
                capitulos: [],

                // templates
                templateFormLivro: false,
                templateListaLivro: true,
                templateFormCapit: false,
                templateListaCapit: false,
                templateLivro: false
            }
        },
        mounted() {
            axios
                .get('http://localhost:8080/api/books')
                .then(resposta => (this.books = resposta.data))
        },

        methods:{
            listar() {
                this.$http.get('books').then(resposta => (
                    this.books = resposta.data
                ))
            },
            listarCap(book) {
                this.$http.get(`books/${book._id}/chapters`).then(resposta => {
                    this.templateListaCapit = true
                    this.templateFormLivro = false
                    this.templateLivro = true
                    this.capitulos = resposta.data
                    this.book = book
                })
            },
            conteudoCap(capitulo) {
                this.$http.get(`books/${this.book._id}/chapters/${capitulo._id}`).then(resposta => {
                    this.capitulo = resposta.data
                })
            },
            salvar() {
                const metodo = this.book._id ? 'put' : 'post'
                const URLfinal = this.book._id ? `/${this.book._id}` : ''
                this.$http[metodo](`/books${URLfinal}`, this.book).then(() => {
                    this.templateFormLivro = false
                    this.book = {}
                    this.listar()
                }).catch(e => {
                    alert(e)
                })
            },

            editar(book){
                this.book = book
                this.templateFormLivro = true
                this.templateListaCapit = false
                this.templateLivro = false
            },

            excluir(book){
                if (confirm('Deseja realmente excluir?')) {
                    // this.book = {...this.books[book._id]}
                    this.$http.delete(`books/${book._id}`, {data: book}).then(() => {
                        this.templateListaCapit = false
                        this.templateLivro = false
                        this.listar()
                    }).catch(e => {
                        alert(e)
                    })
                }
            },
            addCap(book){
                this.templateFormCapit = true
                // this.templateListaCapit = false
                this.capitulo = {}
                this.book._id = book._id
            },
            salvaCapitulo(){
                const metodo = this.capitulo._id ? 'put' : 'post'
                const URLfinal = this.capitulo._id ? `${this.book._id}/chapters/${this.capitulo._id}` : `${this.book._id}/chapters`
                this.$http[metodo](`/books/${URLfinal}`, this.capitulo).then(() => {
                    this.templateFormCapit = false
                    this.listarCap(this.book)
                }).catch(e => {
                    alert(e)
                })
            },
            editarCap(){
                this.templateFormCapit = true
            },
            excluirCap(){
                if (confirm('Deseja realmente excluir?')) {
                    // this.book = {...this.books[book._id]}
                    this.$http.delete(`/books/${this.book._id}/chapters/${this.capitulo._id}`, {data: this.capitulo}).then(() => {
                        this.listarCap(this.book)
                    }).catch(e => {
                        alert(e)
                    })
                }
            }
        }
    }
</script>

<style>
    .lista-card:hover
    {
        border: 1px solid #dbdad9;
    }
    .lista-card {
        cursor: pointer;
    }
</style>