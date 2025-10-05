package cpsc415;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.PostConstruct; // Import for initialization

@Service
public class BookService {

    public List<Book> bookList = new ArrayList<>();

    private int idCounter = 1;

    // 1. New method to initialize books at startup
    @PostConstruct
    public void initializeBooks() {
        addInitialBook("Book of Thieves", 987654321);
        addInitialBook("Percius Jackstonian", 123456789);
        addInitialBook("The Hobbit", 123456789);
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
    // It NO LONGER needs the 'id' parameter from the frontend.
    public void addBook(String title, Integer ISBN) {
        Book book = new Book();

        // Assign the current counter value and then increment it for the next book
        book.setId(idCounter++);

        book.setTitle(title);
        book.setISBN(ISBN);
        bookList.add(book);

        System.out.println(title + " added with ID: " + book.getId());
    }

    public List<Book> getBooks() {
        return bookList;
    }

    public void deleteBook(Integer id) {
        // Improved delete logic using List.removeIf (Java 8+) for cleaner code
        boolean removed = bookList.removeIf(book -> book.getId().equals(id));

        if (removed) {
            System.out.println("Book with ID " + id + " deleted");
        } else {
            throw new RuntimeException("Book with ID " + id + " not found");
        }
    }
}