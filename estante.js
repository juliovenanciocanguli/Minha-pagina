// ======================================
// UNIJ — PESQUISA DA ESTANTE DE LIVROS
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("shelfSearch");

    const books = Array.from(
        document.querySelectorAll(".shelf-book")
    );

    const sections = Array.from(
        document.querySelectorAll(".shelf-category")
    );

    const buttons = Array.from(
        document.querySelectorAll(".shelf-filter")
    );

    const emptyMessage = document.getElementById("shelfEmpty");
    const count = document.getElementById("shelfCount");

    if (!searchInput) {
        return;
    }

    let selectedCategory = "todos";

    function normalizeText(text) {
        return text
            .toLocaleLowerCase("pt-PT")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    function filterBooks() {

        const term = normalizeText(searchInput.value.trim());

        let visibleBooks = 0;

        books.forEach(function (book) {

            const category = (
                book.dataset.category || ""
            ).toLowerCase();

            const searchContent = normalizeText(
                (book.dataset.search || "") + " " + book.textContent
            );

            const categoryMatches =
                selectedCategory === "todos" ||
                category === selectedCategory;

            const textMatches =
                searchContent.includes(term);

            const visible = categoryMatches && textMatches;

            book.hidden = !visible;

            if (visible) {
                visibleBooks++;
            }

        });

        sections.forEach(function (section) {

            const hasVisibleBooks = Array.from(
                section.querySelectorAll(".shelf-book")
            ).some(function (book) {
                return !book.hidden;
            });

            section.hidden = !hasVisibleBooks;

        });

        if (emptyMessage) {
            emptyMessage.hidden = visibleBooks !== 0;
        }

        if (count) {
            count.textContent =
                visibleBooks === 1
                    ? "1 livro encontrado"
                    : visibleBooks + " livros encontrados";
        }

    }

    buttons.forEach(function (button) {

        button.addEventListener("click", function () {

            selectedCategory = (
                button.dataset.category || "todos"
            ).toLowerCase();

            buttons.forEach(function (item) {

                const active = item === button;

                item.classList.toggle("active", active);

                item.setAttribute(
                    "aria-pressed",
                    String(active)
                );

            });

            filterBooks();

        });

    });

    searchInput.addEventListener("input", filterBooks);

    filterBooks();

});
