package cpsc415;


import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookService {
    public List<Book> bookList = new ArrayList<>();

    public void addBook(Integer id, String title, Integer ISBN){
        Book book = new Book();
        book.setId(1);
        book.setTitle("Book of Thieves");
        book.setISBN(987654321);
        bookList.add(book);

        Book book2 = new Book();
        book2.setId(2);
        book2.setTitle("Percius Jackstonian");
        book2.setISBN(123456789);
        bookList.add(book2);

        Book book3 = new Book();
        book3.setId(3);
        book3.setTitle("The Hobbit");
        book3.setISBN(123456789);
        bookList.add(book3);
        System.out.println(book3.getTitle() + " added");

        System.out.println(title + " added");
    }

    public List<Book> getBooks() {
        return bookList;
    }


    public void deleteBook(Integer id) {
        for (Book book : bookList) {
            if (book.getId() == id) {
                bookList.remove(book);
                System.out.println(book.getTitle() + " deleted");
                return;
            }
            else {
                continue;
            }
        }
        throw new RuntimeException("Book not found");
    }

}