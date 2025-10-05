package cpsc415;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.PostConstruct;

@Service
public class BookService {

    public List<Book> bookList = new ArrayList<>();

    private int idCounter = 1;

    // 1. New method to initialize books at startup
    @PostConstruct
    public void initializeBooks() {
        addInitialBook("Book of Saints", 987654321);
        addInitialBook("Percius Jackstonian", 123456789);
        addInitialBook("The Harriet Potta", 123456789);
    }

    // Helper method to add initial books with automatic ID assignment
    private void addInitialBook(String title, Integer ISBN) {
        Book book = new Book();
        book.setId(idCounter++); // Assign ID and increment counter
        book.setTitle(title);
        book.setISBN(ISBN);
        bookList.add(book);
    }

    // 2. Updated: addBook now ONLY handles the book being added from the API
    // request
    public void addBook(String title, Integer ISBN) {
        Book book = new Book();
        book.setId(idCounter++);

        book.setTitle(title);
        book.setISBN(ISBN);
        bookList.add(book);

        System.out.println(title + " added with ID: " + book.getId());
    }

    public List<Book> getBooks() {
        return bookList;
    }

    // 3. Updated: deleteBook now uses removeIf for cleaner code
    public void deleteBook(Integer id) {
        boolean removed = bookList.removeIf(book -> book.getId().equals(id));

        if (removed) {
            System.out.println("Book with ID " + id + " deleted");
        } else {
            throw new RuntimeException("Book with ID " + id + " not found");
        }
    }
}