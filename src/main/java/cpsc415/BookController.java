package cpsc415;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class BookController {
    @Autowired
    private BookService bookService;

    @PostMapping("/add")
    public String addBook(Integer id, String title, Integer ISBN) {
        bookService.addBook( id, title, ISBN);
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

}