# My Spring Container

## Purpose

This project demonstrates a simple **Spring Boot 2.7** application (Java
17) that ships with **Swagger-powered API documentation** and is
packaged with **Maven** for easy local and containerized builds.

## What the App Does

The service exposes a minimal in-memory catalog of books.\
Calling the REST endpoints:

-   Seeds two sample titles
-   Lists the current collection
-   Allows deletion by identifier

👉 No database required.

## Available Endpoints

-   **POST `/add`** -- populates the catalog with two sample books
    (request parameters are currently ignored).
-   **GET `/view`** -- returns the current in-memory list of books.
-   **DELETE `/delete/{id}`** -- removes a book by its numeric id if it
    exists.

Swagger UI documentation is generated at:\
<http://localhost:8080/swagger-ui/index.html>

------------------------------------------------------------------------

## Build and Run

### Using Maven (recommended)

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

**Run the packaged jar:**

``` bash
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

### Using Docker

**Build the container image:**

``` bash
docker build -t my-spring-container .
```

**Run the container (exposes port 8080):**

``` bash
docker run --rm -p 8080:8080 my-spring-container
```

The final runtime layer uses **Eclipse Temurin JRE 17** and runs
`java -jar app.jar` with port 8080 exposed.

------------------------------------------------------------------------

## How to Use the API

### Seed the catalog

``` bash
curl -X POST http://localhost:8080/add
```

Responds with HTTP 200 and loads two sample entries:

``` json
[
  {"id":1,"title":"Book of Thieves","ISBN":987654321},
  {"id":2,"title":"Percius Jackstonian","ISBN":123456789}
]
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

Open <http://localhost:8080/swagger-ui/index.html> in a browser to try
the endpoints through Swagger UI.
