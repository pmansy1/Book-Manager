package cpsc415;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class BookController {
    @Autowired
    private BookService bookService;

    @PostMapping("/add")
    public void addBook(Integer id, String title, Integer ISBN) {
        bookService.addBook( id, title, ISBN);
    }

    @GetMapping("/view")
    public List<Book> viewBooks() {
        return bookService.getBooks();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteBook(@PathVariable Integer id) {
        bookService.deleteBook(id);
    }

}