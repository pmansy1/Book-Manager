package cpsc415;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class BookController {
    @Autowired
    private BookService bookService;

    @PostMapping("/add")
    public String addBook(String title, Integer isbn) {
        bookService.addBook(title, isbn);
        return title + "has been added";
    }

    @GetMapping("/view")
    public List<Book> viewBooks() {
        return bookService.getBooks();
    }

    @DeleteMapping("/delete/{id}")
    public String deleteBook(@PathVariable Integer id) {
        bookService.deleteBook(id);
        return " Book deleted";
    }

    @PutMapping("/update/{id}")
    public String updateBook(@PathVariable Integer id, @RequestParam String title) {
        bookService.updateBookTitle(id, title);
        return "Book ID " + id + " title updated to: " + title;
    }

}