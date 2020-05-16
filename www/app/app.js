let debouncer;
const app = new Vue({
  el: '#app',
  data: function () {
    return {
      title: 'english dictionary',
      word: '',
      currentPage: 1,
      lastPage: -1,
      words: [],
      resultsPerPage: 20,
    }
  },
  mounted: function () {
    this.query('', this.resultsPerPage);
  },
  methods: {
    query: function (word, resultsPerPage, page) {
      axios.get(`/define?word=${word}&resultsPerPage=${resultsPerPage}&page=${page}`).then(response => {
        this.currentPage = response.data.pagination.currentPage;
        this.lastPage = response.data.pagination.lastPage;
        this.words = response.data.words;
      })
    },
    search: function () {
      clearTimeout(debouncer);
      debouncer = setTimeout(() => {
        this.query(this.word);
      }, 666);
    },
    goto: function (page) {
      this.query(this.word, this.resultsPerPage, page);
    }
  },
  computed: {
    pages: function () {
      let range = (a, b) => a > b ? range(b, a).reverse() : (a === b ? [a] : range(a, b - 1).concat(b));
      if (this.currentPage > -1) {
        return range(this.currentPage, (this.lastPage >= this.currentPage + 9) ? this.currentPage + 9 : this.lastPage);
      } else {
        return [];
      }
    }
  }
})