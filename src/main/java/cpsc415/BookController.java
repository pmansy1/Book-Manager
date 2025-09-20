package cpsc415;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class BookController {
    @Autowired
    private BookService bookService;

    @PostMapping("/add")
    public void addBook() {
        bookService.addBook();
    }

    @GetMapping("/view")
    public List<Book> viewBooks() {
        return bookService.getBooks();
    }

    @GetMapping("/hello")
    public String hello(){
        return "Hello World!";
    }
}