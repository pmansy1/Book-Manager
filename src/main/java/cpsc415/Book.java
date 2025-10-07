package cpsc415;

public class Book {
    private Integer id;

    private String title;

    private Integer isbn;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getISBN() {
        return isbn;
    }

    public void setISBN(Integer isbn) {
        this.isbn = isbn;
    }

    @Override
    public String toString() {
        return "Book{" + "id=" + id + ", title=" + title + ", ISBN=" + isbn + '}';
    }

}