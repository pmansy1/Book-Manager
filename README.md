
# My Spring Container

## Purpose

This project demonstrates a simple **Spring Boot** application (Java
17) that ships with **Swagger-powered API documentation** and is
packaged with **Maven** for easy local and containerized builds.

## What the App Does

The service exposes a minimal in-memory catalog of books.\
Calling the REST endpoints:

-   Seeds two sample titles
-   Lists the current collection
-   Allows deletion by identifier

No database required.

## Available Endpoints

-   **POST `/add`** -- populates the catalog with two sample books
    (request parameters are currently ignored).
-   **GET `/view`** -- returns the current in-memory list of books.
-   **DELETE `/delete/{id}`** -- removes a book by its numeric id if it
    exists.

Swagger UI documentation is generated at:\
<http://localhost:8080/swagger-ui>

------------------------------------------------------------------------

## Build and Run

### Using Maven 

**Build the executable jar:**

``` bash
./mvnw clean package
```

**Run tests (optional):**

``` bash
./mvnw test
```

**Launch the application locally:**

``` bash
./mvnw spring-boot:run
```

The service starts on port `8080` by default.


### Using Docker

**Build the container image:**

``` bash
docker build -t my-spring-container .
```

**Run the container (exposes port 8080):**

``` bash
docker run --rm -p 8080:8080 my-spring-container
```

------------------------------------------------------------------------

## How to Use the API

### Seed the catalog

``` bash
curl -X POST http://localhost:8080/add
```

### View all books

``` bash
curl http://localhost:8080/view
```

Returns the current list in JSON.

### Delete a book

``` bash
curl -X DELETE http://localhost:8080/delete/1
```

Removes the book with `id = 1`.\
Deleting a missing id results in an error response.

------------------------------------------------------------------------

## Explore the API Visually

Open <http://localhost:8080/swagger-u> in a browser to try
the endpoints through Swagger UI


View all books

``` bash
curl http://localhost:8080/view
```

Returns the current list in JSON.

Delete a book
``` bash
curl -X DELETE http://localhost:8080/delete/1
```

Removes the book with id = 1; deleting a missing id results in an error response.

