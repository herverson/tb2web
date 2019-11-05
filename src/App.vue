<template>
    <div>
        <Header />
        <div class="container">
            <br>
            <br>
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
                        <button class="btn btn-primary"><i class="material-icons">save</i></button>
                        <b-alert show dismissible fade v-if="sucesso" variant="success">
                            Salvo!
                        </b-alert>
                    </form>
                </div>
            </div>
            <br>
            <br>
            <br>
            <div class="row">
                <div class="col-md-3" v-for="book of books" :key="book._id" @click="listarCap(book)">
                    <div class="card lista-card" style="margin: 10px 0px 0px 10px;">
                        <div class="card-header">{{book.titulo}} </div>
                        <div class="card-body">
                            <p class="card-text">{{book.ano_publicacao}}</p>
                            <p class="card-text">{{book.autor}}</p>
                        </div>
                        <div class="card-footer bg-transparent">
                            <button @click="editar(book)" class="btn btn-sm btn-primary"><i class="material-icons">create</i></button>
                            &nbsp;
                            <button @click="excluir(book)" class="btn btn-sm btn-danger"><i class="material-icons">delete_sweep</i></button>
                            &nbsp;
                            <button @click="addCap(book)" class="btn btn-sm btn-danger"><i class="material-icons">delete_sweep</i></button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="form-group">
                    <label for="nomeCapitulo">Nome do Cápitulo</label>
                    <input type="text" class="form-control" id="nomeCapitulo" placeholder="Cápitulo" v-model="capitulo.nome">
                </div>
                <div class="form-group">
                    <label for="anoPub">Conteúdo do Cápitulo</label>
                    <textarea class="form-control" id="anoPub" placeholder="Conteúdo" rows="3" v-model="capitulo.conteudo"></textarea>
                </div>
                <b-button @click="salvaCapitulo">
                    salvar!
                </b-button>
            </div>
            <div role="tablist">
                <b-card no-body class="mb-1" v-for="(chapter,index) in capitulos" :key="index">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                        <button type="button" class="btn btn-info btn-block" v-b-toggle:aria-controls="chapter._id" @click="conteudoCap(chapter)">{{chapter.nome}}</button>

<!--                        <b-button block v-b-toggle.acc @click="conteudoCap(capitulo)" variant="info">{{capitulo.nome}}</b-button>-->
                    </b-card-header>
                    <b-collapse :id="chapter._id" accordion="my-accordion" role="tabpanel">
                        <b-card-body>
<!--                            <b-card-text>{{index}}</b-card-text>-->
                            <b-card-text>{{capitulo.conteudo}}</b-card-text>
                        </b-card-body>
                    </b-collapse>
                </b-card>
            </div>


<!--            <div class="list-group">-->
<!--                <div class="list-group-item" v-for="capitulo of capitulos" :key="capitulo._id" @click="conteudoCap(capitulo)">-->
<!--                    <h3>{{capitulo.nome}}</h3>-->
<!--                    <div class="list-group">-->
<!--                        &lt;!&ndash;                <div class="list-group-item" v-for="capitulo of capitulos" :key="capitulo._id" @click="conteudoCap(capitulo)">&ndash;&gt;-->
<!--                        <p>{{capitulo.conteudo}}</p>-->
<!--                        &lt;!&ndash;                </div>&ndash;&gt;-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->

<!--            <div class="list-group">-->
<!--&lt;!&ndash;                <div class="list-group-item" v-for="capitulo of capitulos" :key="capitulo._id" @click="conteudoCap(capitulo)">&ndash;&gt;-->
<!--                    <p>{{capitulo.conteudo}}</p>-->
<!--&lt;!&ndash;                </div>&ndash;&gt;-->
<!--            </div>-->

        </div>
    </div>
</template>

<script>
    import Book from './services/livros'
    import Header from './components/Header'
    export default {
        components: {
            Header
        },
        data() {
            return {
                idBook: '',
                book: {
                    _id: '',
                    titulo: '',
                    ano_publicacao: '',
                    autor: '',
                },
                sucesso: false,
                books: [],
                capitulo: {
                    _id: '',
                    nome: '',
                    conteudo: ''
                },
                capitulos: []
            }
        },
        mounted() {
            this.listar()
        },

        methods:{
            listar() {
                Book.listar().then(resposta => {
                    this.books = resposta.data
                })
            },
            listarCap(book) {
                this.$http.get(`books/${book._id}/chapters`).then(resposta => {
                    this.capitulos = resposta.data
                    this.idBook = book._id
                })
            },
            conteudoCap(capitulo) {
                this.$http.get(`books/${this.idBook}/chapters/${capitulo._id}`).then(resposta => {
                    this.capitulo = resposta.data
                })
            },
            salvar() {
                const metodo = this.book._id ? 'put' : 'post'
                const URLfinal = this.book._id ? `/${this.book._id}` : ''
                this.$http[metodo](`/books${URLfinal}`, this.book).then(() => {
                    this.book = {}
                    this.listar()
                }).catch(e => {
                    this.errors = e.response.data.errors
                })
            },

            editar(book){
                this.book = book
            },

            excluir(book){
                if (confirm('Deseja realmente excluir?')) {
                    // this.book = {...this.books[book._id]}
                    this.$http.delete(`books/${book._id}`, {data: book}).then(() => {
                        this.listar()
                        this.errors = []
                    }).catch(e => {
                        this.errors = e.response.data.errors
                    })
                }
            },
            addCap(book){
              this.book._id = book._id
            },
            salvaCapitulo(){
                Book.salvarCapitulo(this.book, this.capitulo).then(() => {
                    // alert('passou')
                    this.book = {}
                    this.capitulo = {}
                    this.listar()
                    this.errors = []
                    // this.sucesso = true
                }).catch(e => {
                    alert(e)
                })
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