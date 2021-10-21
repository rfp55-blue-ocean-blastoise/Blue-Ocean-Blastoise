<!-- TABLE OF CONTENTS -->

  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#Usage">Server Routes</a>
      <ul>
        <li><a href="#post">Post Users</a></li>
      </ul>
       <ul>
        <li><a href="#get">Get Library</a></li>
      </ul>
      <ul>
        <li><a href="#upload">Upload EPUB</a></li>
      </ul>
      <ul>
        <li><a href="#put">Update Bookmark</a></li>
      </ul>
      <ul>
        <li><a href="#remove">Delete Book</a></li>
      </ul>
      <ul>
        <li><a href="#s3">Get All s3 Objects</a></li>
      </ul>   
    </li>
  </ol>



<!-- USAGE EXAMPLES -->
## Usage

### Server Routes

Post User: 
 - POST "/users" 
 - Send request through JSON Object Body
 - Body Parameters: 
    - email: String


Get Library:
  - GET "/library"
  - Send request through Query Parameters
  - Query Parameters:
    - email: String

Upload EPUB:
  - POST "/upload"
  - Send EPUB through File Parameters
  - Send request through JSON Object Body
  - File Parameters:
    - EPUB
  - Body Parameters:
    - email: String

Update Bookmark
  - PUT "/library"
  - Send request through JSON Object Body
  - Body Parameters:
    - email: String
    - title: String
    - cfi: String
    - remainingText: String
  - Returns a string response with:
    ```javacsript
    User:"test@test.com", 
    Book:"alice.epub", 
    UpdatedCFI: "epubcfi(/6/14[chap05ref]!/4[body01]/10/2/1:3[2^[1^]])", 
    remainingText:“These,are...words"
    ```
    
Delete Book
  - DELETE "/library"
  - Send request through JSON Object Body
  - Body Parameters:
    - email: String
    - title: String

Get All s3 Objects
  - GET "/listObjects"
  - Send request through Query Paramters
  - Query Parameters:
    - Bucket: "s3-bucket-name"
  - Returns a JSON Object:
    ```json
    [{
        "Key": "5a56asd9w5da6sda9sda.epub",
        "Etag": "\"5a56asd9w5da6sda9sda\"",
        "size": 500133,
        "URL": "https://.....epub"
    }]
    ```

  


<p align="right">(<a href="#top">back to top</a>)</p>
