# Bookshelf - API plan

## Roles
- Anonymus: Basic view access to all features of the website, cannot post anything
- User: View access to all features, is able to write reviews, comments, has a personal profile with an own booklist. Delete access to own content and profile
- Editor: All features of the User role, can also write summaries and add additional books
- Admin: Unrestricted access to the entire website 

## Relations
- A `book` has a single user (editor role) as a creator, multiple books can be created by a single user
- A `review` has a single `user` (any role) as a creator, multiple reviews can be written by a single user
- A `review` is written to a single `book`, multiple reviews could be written to a single book
- A `comment` is a response to a single `review`, multiple comments could be written to a single review
- A `summary` is made by a single `user` (editor role), multiple summaries could be written by a single user
- A `summary` is attached to a single `book`, multiple summaries could be written to a single book

## End points

Every collection in the database shares the same five end points, varying in functionality

### Users

- **GET /api/users?username?email?minCreate?maxCreate?minUpdate?maxUpdate?updated_at?last_login?role?fields?page?limit**
    - Query accessibility:
        - Anonymus: username, page, limit
        - User: username, min/maxCreate,min/maxUpdate, last_login, role, page, limit
        - Editor: username, min/maxCreate,min/maxUpdate, last_login, role, page, limit
        - Admin: all queries
    - Field accessibility:
        - Anonymus: _id, username, role, booklist
        - User: _id, username, created_at, updated_at, last_login, role, booklist
        - Editor: _id, username, created_at, updated_at, last_login, role, booklist
        - Admin: all fields
    - The return response is appropriate to the accessibility of the user, in case of an illegal request, no error is thrown and every other legal request will be responded to

- **GET /api/users/{id}?fields**
    - Field accessibility
        - Anonymus: _id, username, role, booklist
        - User (self): all fields except password_hashed
        - User (others): _id, username, created_at, updated_at, last_login, role, booklist
        - Admin: all fields
    - The return response is appropriate to the accessibility of the user, in case on an illegal request, no error is thrown and every other legal request will be responded to

- **POST /api/users**
    - Accessible by Anonymus and Admin
    - Returns a response of the newly created profile

- **PUT /api/users/{id}**    
    - Accessible by User/Editor(self) and Admin
    - Returns a response of the updated profile

- **DELETE /api/users/{id}**
    - Accessible by User/Editor(self) and Admin
    - Returns a response of confirmation
    
### Books

- **GET /api/books?title?author?minRelease?maxRelease?genre?user_id?page?limit**
    - Query accessibility:
        - Anonymus: title, author, page
        - User: title, author, min/maxRelease, genre, user_id, page, limit
        - Editor: title, author, min/maxRelease, genre, user_id, page, limit
        - Admin: all queries
    - Field accessibility:
        - Anonymus: _id,title,author,release,genre,user_id,description
        - User: _id,title,author,release,genre,user_id,description,added_at,updated_at
        - Editor: _id,title,author,release,genre,user_id,description,added_at,updated_at
        -Admin: all fields
    - The return response is appropriate to the accessibility of the user, in case on an illegal request, no error is thrown and every other legal request will be responded to

- **GET /api/books/{id}**
    - Field accessibility:
        - Anonymus: _id,title,author,release,genre,user_id,description
        - User: _id,title,author,release,genre,user_id,description,added_at,updated_at
        - Editor: _id,title,author,release,genre,user_id,description,added_at,updated_at
        -Admin: all fields
    - The return response is appropriate to the accessibility of the user, in case on an illegal request, no error is thrown and every other legal request will be responded to

- **POST /api/books**
    - Accessible by Editor and Admin
    - Returns a response of the newly created book

- **PUT /api/books/{id}**    
    - Accessible by Editor and Admin
    - Returns a response of the updated book

- **DELETE /api/books/{id}**
    - Accessible by Editor and Admin
    - Returns a response of confirmation

### Reviews

- **GET /api/reviews?user_id?book_id?score?minCreate?maxCreate?minUpdate?maxUpdate?page?limit**


- **POST /api/reviews**
    - Accessible by User, Editor and Admin
    - Returns a response of the newly created review

- **PUT /api/reviews/{id}**    
    - Accessible by User/Editor(self) and Admin
    - Returns a response of the updated review

- **DELETE /api/reviews/{id}**
    - Accessible by User/Editor(self) and Admin
    - Returns a response of confirmation
        