
const Pagination = Vue.component('Pagination', {
    props: {
        pagination: Object
    },
    methods: {
        goto: function (pageNumber) {
            this.$emit('goto', pageNumber);
        }
    },
    template: `
        <div class="pagination">
            <div v-if="pagination.endPage > pagination.maxPages" style="display: flex;">
                <div class="page-number cursor-pointer"
                    :class="pagination.currentPage === 1 && 'current-page'"
                     @click="goto(1)"
                >
                    1
                </div>
                <div class="page-number">
                    -
                </div>
            </div>
            <div v-if="pagination.totalPages > 1" style="display: flex;">
                <div v-for="page in pagination.pages" 
                    class="page-number cursor-pointer"
                    :class="pagination.currentPage === page && 'current-page'" 
                    @click="goto(page)"
                    :key="page"
                >
                    {{page}}
                </div>
            </div>
            <div v-if="pagination.endPage < pagination.totalPages" style="display: flex;">
                <div class="page-number">-</div>
                <div class="page-number cursor-pointer"
                    :class="pagination.currentPage === pagination.totalPages && 'current-page'" @click="goto(pagination.totalPages)"
                >
                    {{pagination.totalPages}}
                </div>
            </div>
        </div>
    `
  });

let debouncer;
const app = new Vue({
    el: '#app',
    components: { Pagination },
    data: function () {
        return {
            title: 'english dictionary',
            totalResults: 0,
            word: '',
            words: [],
            resultsPerPage: 20,
            pagination: {
                totalItems: 0,
                currentPage: 1,
                pageSize: 1,
                totalPages: 1,
                startPage: 1,
                endPage: 1,
                startIndex: 0,
                endIndex: 0,
                pages: [1]
            }
        }
    },
    mounted: function () {
        this.query('', 20, 1);
    },
    methods: {

        query: function (word, resultsPerPage, page) {
            axios.get(`/define?word=${word}&resultsPerPage=${resultsPerPage}&page=${page}`)
                .then(response => {
                    this.words = response.data.words;
                    Object.assign(this.pagination, response.data.pagination);
                })
                .then(()=> this.highlight(word));
        },

        search: function () {
            clearTimeout(debouncer);
            debouncer = setTimeout(() => {
                this.query(this.word);
            }, 250);
        },

        goto: function (page) {
            this.query(this.word, this.resultsPerPage, page);
        },

        highlight: function (text) {
            const words = document.querySelectorAll('.word');
            if(words) {
                words.forEach(word => {
                    let wordInnerText = word.innerHTML;
                    const wrapperStart = `<span class="highlight">`;
                    const wrapperEnd = `</span>`;
                    wordInnerText = wordInnerText.replace(wrapperStart, '');
                    wordInnerText = wordInnerText.replace(wrapperEnd, '');
                    if(wordInnerText.indexOf(text) > -1) {
                        const highlightedText = `${wrapperStart}${text}${wrapperEnd}`;
                        const output = wordInnerText.replace(text, highlightedText);
                        word.innerHTML = output;
                    } else {
                        word.innerHTML = wordInnerText;
                    }
                });
            }
        },

    }
})