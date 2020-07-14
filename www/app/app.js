let debouncer;
const app = new Vue({
    el: '#app',
    data: function () {
        return {
            title: 'english dictionary',
            totalResults: 0,
            word: '',
            currentPage: 1,
            lastPage: -1,
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
                pages: [1, 2]
            }
        }
    },
    mounted: function () {
        this.query('', this.resultsPerPage);
    },
    methods: {
        query: function (word, resultsPerPage, page) {
            axios.get(`/define?word=${word}&resultsPerPage=${resultsPerPage}&page=${page}`)
                .then(response => {
                    this.currentPage = response.data.pagination.currentPage;
                    this.lastPage = response.data.pagination.lastPage;
                    this.words = response.data.words;
                    Object.assign(this.pagination, response.data.pagination);
                })
                .then(()=> this.highlight(word));
        },
        search: function () {
            clearTimeout(debouncer);
            debouncer = setTimeout(() => {
                this.query(this.word);
            }, 666);
        },
        goto: function (page) {
            this.query(this.word, this.resultsPerPage, page);
        },
        highlight: function (text) {
            const words = document.querySelectorAll('.word');
            if(words) {
                words.forEach(word => {
                    let wordInnerText = word.innerHTML;
                    const wrapperStart = `<span style="font-weight: bold;">`;
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
    },
    computed: {
        // pages: function () {
        //     let range = (a, b) => a > b ? range(b, a).reverse() : (a === b ? [a] : range(a, b - 1).concat(b));
        //     if (this.currentPage > -1) {
        //         return range(this.currentPage, (this.lastPage >= this.currentPage + 9) ? this.currentPage + 9 : this.lastPage);
        //     } else {
        //         return [];
        //     }
        // }
    }
})